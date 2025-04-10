"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Package } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Order {
  id: string;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered";
  total: number;
  items: {
    id: number;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }[];
}

export default function OrdersPage() {
  const [orders] = useState<Order[]>([
    {
      id: "ORD-001",
      date: "2024-03-20",
      status: "delivered",
      total: 169,
      items: [
        {
          id: 1,
          title: "Classic Heather Gray Hoodie",
          price: 69,
          quantity: 1,
          image: "https://example.com/hoodie.jpg",
        },
        {
          id: 2,
          title: "Classic Grey Hooded Sweatshirt",
          price: 90,
          quantity: 1,
          image: "https://example.com/sweatshirt.jpg",
        },
      ],
    },
    {
      id: "ORD-002",
      date: "2024-03-18",
      status: "shipped",
      total: 98,
      items: [
        {
          id: 3,
          title: "Classic Red Jogger Sweatpants",
          price: 98,
          quantity: 1,
          image: "https://example.com/jogger.jpg",
        },
      ],
    },
  ]);

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "processing":
        return "bg-blue-500";
      case "shipped":
        return "bg-purple-500";
      case "delivered":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <ArrowLeft className="h-4 w-4" />
          Back to shopping
        </Link>

        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center">
              <Package className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">My Orders</h1>
              <p className="text-muted-foreground">
                Track and manage your orders
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Order #{order.id}</CardTitle>
                      <CardDescription>
                        Placed on {new Date(order.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge
                      className={`${getStatusColor(
                        order.status
                      )} text-white capitalize`}
                    >
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 border-b pb-4 last:border-0 last:pb-0"
                      >
                        <div className="h-20 w-20 bg-secondary rounded flex items-center justify-center">
                          <Package className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <p className="font-medium">
                          ${item.price * item.quantity}
                        </p>
                      </div>
                    ))}
                    <div className="flex justify-between pt-4 text-lg font-semibold">
                      <span>Total</span>
                      <span>${order.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}