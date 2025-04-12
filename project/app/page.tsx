"use client";

import { useState, useEffect } from "react";
import { ShoppingCart, User, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/context/cart-context";
import { Product } from "@/lib/types";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { addItem, removeItem, updateQuantity, items, itemCount, total } = useCart();
  const { toast } = useToast();
  const userEmail = "userintheapp@test.com"; 

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("https://api.escuelajs.co/api/v1/products");
      const data = await response.json();
      setProducts(data);

      const uniqueCategories = Array.from(
        new Set(data.map((product: Product) => product.category.name))
      );
      setCategories(Array.from(new Set(data.map((product: Product) => product.category.name as string))));
    };

    fetchProducts();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === "all" ||
      product.category.name.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.title} added to your cart`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold">
              Shopi
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{userEmail}</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/orders" className="flex items-center">
                      <Package className="mr-2 h-4 w-4" />
                      My Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="/account" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      My Account
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="ml-2">Cart ({itemCount})</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>My Order</SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img
                          src={item.images[0]}
                          alt={item.title}
                          className="h-16 w-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            ${item.price}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span>{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeItem(item.id)}
                          >
                            ×
                          </Button>
                        </div>
                      </div>
                    ))}
                    {items.length > 0 ? (
                      <div className="mt-auto pt-4 border-t">
                        <div className="flex justify-between mb-4">
                          <span className="font-medium">Total:</span>
                          <span className="font-medium">${total}</span>
                        </div>
                        <Button className="w-full">Checkout</Button>
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground py-8">
                        Your cart is empty
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <Input
            type="search"
            placeholder="Search products..."
            className="max-w-md"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <Link href={`/product/${product.id}`}>
                <CardHeader className="p-0">
                  <div className="aspect-square relative">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="object-cover w-full h-full"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <Badge variant="secondary" className="mb-2">
                    {product.category.name}
                  </Badge>
                  <h3 className="font-semibold text-lg line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description}
                  </p>
                </CardContent>
              </Link>
              <CardFooter className="p-4 pt-0 flex items-center justify-between">
                <span className="text-lg font-bold">${product.price}</span>
                <Button size="sm" onClick={() => handleAddToCart(product)}>
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}