"use server"

import { scrapeProduct } from "@/lib/firecrawl"
import { createClient } from "@/utils/supabase/server"
import { error } from "console"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"


export const SignOut = async () => {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath("/")
    redirect("/")
}

export const addProduct = async (formData: any) => {
    const url = formData.get("url")
    if (!url) {
        throw new Error("Product URL is required")
    }
    try {
        console.log("heree");

        const supabase = await createClient()
        const { data: user }: any = await supabase.auth.getUser()
        console.log(user, "userr");

        if (!user) {
            throw new Error("Not signed in")
        }
        const productData: any = await scrapeProduct(url)
        console.log(productData);


        if (!productData?.productName || !productData?.currentPrice || !productData?.currencyCode) {
            throw new Error("Invalid product URL")
        }

        const newPrice = parseFloat(productData.currentPrice)
        const currencyCode = productData.currencyCode || "USD"
        const { data: existingProduct } = await supabase.from("products").select("id,current_price").eq("url", url).eq("userId", user?.id).single()

        const isUpdate = !!existingProduct

        const { data: product, error } = await supabase.from("products").upsert({
            user_id: user?.user?.id,
            url,
            name: productData.productName,
            current_price: newPrice,
            currency: currencyCode,
            image_url: productData.productImageUrl,
            updated_at: new Date().toISOString(),
        },
            {
                onConflict: "user_id,url",
                ignoreDuplicates: false,
            }).select("*").single()

        if (error) {
            throw new Error(error.message)
        }
        const shouldAddHistory = !isUpdate || newPrice !== existingProduct.current_price

        if (shouldAddHistory) {
            await supabase.from("price_history").insert({
                product_id: product?.id,
                price: newPrice,
                currency: currencyCode,
                checked_at: new Date().toISOString(),
            })
        }
        revalidatePath("/")

        return {
            success: true,
            product,
            message: isUpdate ? "Product updated successfully" : "Product added successfully",
        }

    }
    catch (e: any) {
        // throw new Error(e.message || "Error adding product")
        return { error: e.message }
    }
}

export const deleteProduct = async (id: string) => {
    try {
        const supabase = await createClient()
        const { error } = await supabase.from("products").delete().eq("id", id)
        if (error) {
            throw new Error(error.message)
        }
        revalidatePath("/")
        return {
            success: true,
            message: "Product deleted successfully",
        }
    }
    catch (e: any) {
        throw new Error(e.message)
    }
}

export const getProducts = async () => {
    try {
        const supabase = await createClient()
        const { data: user }: any = await supabase.auth.getUser()
        console.log(user, "userr");

        if (!user) {
            throw new Error("Not signed in")
        }
        const { data: products, error } = await supabase.from("products").select("*").eq("user_id", user?.user?.id).order("created_at", { ascending: true })
        if (error) {
            throw new Error(error.message)
        }
        return products || []
    }
    catch (e: any) {
        return { error: e.message || 'Error fetching products' }
    }
}

export const getPriceHistory = async (productId: string) => {
    try {
        console.log(productId, "idd");

        const supabase = await createClient()
        const { data: history, error } = await supabase.from("price_history").select('*').eq("product_id", productId).order("checked_at", { ascending: true })
        console.log(history, error, "jjdjs");

        if (error) {
            throw new Error(error.message)
        }
        return history || []
    }
    catch (e: any) {
        return { error: e.message || 'Error fetching products' }
    }
}