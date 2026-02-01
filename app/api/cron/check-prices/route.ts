import { sendPriceAlertEmail } from "@/lib/Email";
import { scrapeProduct } from "@/lib/firecrawl";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({ message: "Cron job to check prices executed." });
}

export async function POST(request: any) {
    try {
        const authHeader = request.headers.get("Authorization");
        const cronSecret = process.env.CRON_API_KEY;
        if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: products, error: fetchError } = await supabase
            .from("products")
            .select("*");
        if (fetchError) {
            throw fetchError;
        }

        const results: any = {
            total: products.length,
            updated: 0,
            failed: 0,
            priceChanges: 0,
            alertsSent: 0
        }

        for (const product of products) {
            try {

                const productData: any = await scrapeProduct(product.url);

                if (!productData?.currentPrice) {
                    results.failed += 1;
                    continue;
                }

                const newPrice = parseFloat(productData.currentPrice);
                const oldPrice = parseFloat(product.current_price);

                await supabase.from("products").update({
                    current_price: newPrice,
                    updated_at: new Date().toISOString(),
                    currency: productData.currency || product.currency,
                    image_url: productData.image_url || product.image_url,
                    name: productData.name || product.name,

                }).eq("id", product.id);

                if (newPrice !== oldPrice) {
                    await supabase.from("price_history").insert({
                        product_id: product.id,
                        price: newPrice,
                        checked_at: new Date().toISOString(),
                        currency: productData.currency || product.currency,
                    })
                    results.priceChanges += 1;
                    if (newPrice < oldPrice) {
                        const { data: { user } }: any = await supabase.auth.admin.getUserById(product.user_id);

                        if (user?.email) {

                            await sendPriceAlertEmail({
                                email: user.email,
                                product,
                                OldPrice: oldPrice,
                                NewPrice: newPrice
                            })

                        }
                        // Send alert email
                        // await supabase.functions.invoke('send-price-drop-alert', {
                    }
                }

            }
            catch (err) {
                results.failed += 1;
            }
        }

        return NextResponse.json({
            success: true,
            message: "Cron job to check prices executed.",
            results
        });


    }
    catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}