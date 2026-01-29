"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { ToggleTheme } from "../ui/toggle-theme";
import Cadastro from "./Cadastro";
import Login from "./Login";

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState("signin");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-[#1e1e1e] p-4 overflow-auto">
      <Card
        className={cn(
          "w-full transition-all duration-500 ease-in-out py-6 rounded-2xl px-4 max-w-lg"
        )}
      >
        <CardHeader className="text-center">
          <div className="flex justify-between items-center mb-4 mx-auto w-full">
            <div className="flex-1" />
            <div className="mx-auto flex flex-col items-center gap-2">
              <img
                src="/images/logo-v4.png"
                alt="V4 Company"
                className="h-16 w-16 mx-auto"
              />
              {/* MUDANÇA AQUI: LIFE -> GROW */}
              <CardTitle className="text-2xl font-bold">GROW</CardTitle>
            </div>
            <div className="flex-1 flex justify-end">
              <ToggleTheme />
            </div>
          </div>
          {/* Removi o segundo CardTitle para não duplicar, já coloquei junto do logo */}
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
              <TabsTrigger value="signin">Entrar</TabsTrigger>
              <TabsTrigger value="signup">Cadastrar</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <div className="flex justify-center">
                <div className="w-full">
                  <Login />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <div className="flex justify-center">
                <div className="w-full">
                  <Cadastro />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}