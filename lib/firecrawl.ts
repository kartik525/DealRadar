import Firecrawl from "@mendable/firecrawl-js";

const firecrawl = new Firecrawl({ apiKey: process.env.NEXT_PUBLIC_FIRECRAWL_KEY });

export const scrapeProduct = async (url: string) => {
    try {
        const result = await firecrawl.scrape(url, {
            formats: [{
                type: 'json',
                prompt:
                    "Extract the product name as 'productName', current price as a number as 'currentPrice', currency code (USD, EUR, etc) as 'currencyCode', and product image URL as 'productImageUrl' if available",
                schema: {
                    type: "object",
                    required: ["productName", "currentPrice", "currencyCode"],
                    properties: {
                        productName: { type: "string" },
                        currentPrice: { type: "number" },
                        currencyCode: { type: "string" },
                        productImageUrl: { type: "string" },
                    },
                }
            }]
        });

        const extractedData = result.json;
        if (!extractedData) {
            throw new Error('No data found');
        }

        return extractedData
    } catch (error: any) {
        console.log(error)
        throw new Error(error.message);
    }
}