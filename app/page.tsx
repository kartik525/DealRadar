import AddProductForm from "@/components/AddProductForm";
import AuthButton from "@/components/AuthButton";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { Bell, LogIn, Rabbit, RadarIcon, Shield, TrendingDown } from "lucide-react";
import Image from "next/image";
import { getProducts } from "./actions";
import ProductCard from "@/components/ProductCard";


export default async function Home() {

  const supabase = createClient()

  const {
    data: { user },
  } = await (await supabase).auth.getUser()

  const products: any = user ? await getProducts() : []
  console.log(products, "pross");

  const FEATURES = [
    {
      icon: Rabbit,
      title: "Lightning Fast",
      description:
        "Deal Drop extracts prices in seconds, handling JavaScript and dynamic content",
    },
    {
      icon: Shield,
      title: "Always Reliable",
      description:
        "Works across all major e-commerce sites with built-in anti-bot protection",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Get notified instantly when prices drop below your target",
    },
  ];
  return (
    <main className=" min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold text-orange-500">Deal<span className="font-bold text-blue-950">Radar</span></h1>

          </div>
          {/* <Button variant="default" size="sm" className="bg-orange-500 hover:bg-blue-950"><LogIn className="w-4 h-4" />Sign In</Button> */}
          <AuthButton user={user} />
        </div>
      </header>
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">Never Miss a Deal</h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Track your favorite products and get notified when they drop below your target price.
          </p>
          {/* Add Product Form code here */}
          <AddProductForm user={user} />


          {products?.length === 0 &&
            <>
              <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16">
                {FEATURES.map(({ icon: Icon, title, description }) => (
                  <div
                    key={title}
                    className="bg-white p-6 rounded-xl border border-gray-200">
                    <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <Icon className="text-orange-500" />

                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600">
                      {description}
                    </p>

                  </div>

                ))}
              </div>
            </>
          }



        </div>
      </section>

      {user && products?.length > 0 && (
        <section className="max-w-7xl mx-auto pb-12 ">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-gray-900">Your Tracked Products</h3>
            <p>{products?.length} {products?.length === 1 ? "product" : "products"}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 mt-4">
            {products?.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </section>
      )}
      {user && products?.length === 0 && (
        <section className="max-w-2xl mx-auto pb-20 px-4 text-center">
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-500 p-12">
            <TrendingDown className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products added</h3>
            <p className="text-sm text-gray-600">Add a product to get started</p>
          </div>

        </section>
      )}

    </main>
  );
}
