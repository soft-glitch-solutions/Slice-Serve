import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star, Zap, Clock, Shield } from "lucide-react";
import { toast } from "sonner";

interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: JSX.Element;
}

const storeItems: StoreItem[] = [
  {
    id: "extra-time",
    name: "Extra Time",
    description: "+2 seconds per level",
    price: 100,
    icon: <Clock className="w-6 h-6" />
  },
  {
    id: "power-slice",
    name: "Power Slice",
    description: "Slice through anything!",
    price: 200,
    icon: <Zap className="w-6 h-6" />
  },
  {
    id: "shield",
    name: "Shield",
    description: "One free mistake",
    price: 300,
    icon: <Shield className="w-6 h-6" />
  }
];

const Store = ({ onClose }: { onClose: () => void }) => {
  const [coins] = useState(() => {
    const saved = localStorage.getItem('coins');
    return saved ? parseInt(saved) : 0;
  });

  const handlePurchase = (item: StoreItem) => {
    if (coins < item.price) {
      toast.error("Not enough coins!");
      return;
    }
    
    const newCoins = coins - item.price;
    localStorage.setItem('coins', newCoins.toString());
    toast.success(`Purchased ${item.name}!`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-orange-600">Store</h2>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            <span className="font-bold">{coins}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          {storeItems.map((item) => (
            <div 
              key={item.id}
              className="flex items-center justify-between p-4 bg-orange-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
              <Button
                onClick={() => handlePurchase(item)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {item.price} <Star className="w-4 h-4 ml-1" />
              </Button>
            </div>
          ))}
        </div>
        
        <Button 
          onClick={onClose}
          className="w-full mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800"
        >
          Close
        </Button>
      </div>
    </div>
  );
};

export default Store;