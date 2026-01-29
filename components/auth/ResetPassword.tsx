import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const formSchema = z
  .object({
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    passwordConfirmation: z
      .string()
      .min(6, "Senha deve ter pelo menos 6 caracteres"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "As senhas não coincidem",
    path: ["passwordConfirmation"],
  });

export default function ResetPassword({ desde }: { desde: Date }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] =
    useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const response = await fetch("/api/cadastro/user/reset", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.ok) {
      toast.success("Senha alterada com sucesso");
      reset();
    } else {
      const error = await response.json();
      toast.error(error.error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Segurança</CardTitle>
        <CardDescription>Gerencie a segurança da sua conta</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Dialog>
            <DialogTrigger>
              <Button variant="outline">Alterar Senha</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Alterar Senha</DialogTitle>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="space-y-2 relative">
                    <Label
                      htmlFor="signup-password"
                      className={errors.password && "text-red-500"}
                    >
                      {errors.password ? errors.password.message : "Senha"}
                    </Label>
                    <Input
                      id="signup-password"
                      {...register("password")}
                      type={showPassword ? "text" : "password"}
                      placeholder="Digite sua senha"
                      className={errors.password ? "border-red-500" : ""}
                    />
                    <Button
                      className="absolute right-0 bottom-0"
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </Button>
                  </div>
                  <div className="space-y-2 relative">
                    <Label
                      htmlFor="signup-password-confirmation"
                      className={errors.passwordConfirmation && "text-red-500"}
                    >
                      {errors.passwordConfirmation
                        ? errors.passwordConfirmation.message
                        : "Confirmação de Senha"}
                    </Label>
                    <Input
                      id="signup-password-confirmation"
                      {...register("passwordConfirmation")}
                      type={showPasswordConfirmation ? "text" : "password"}
                      placeholder="Confirme sua senha"
                      className={
                        errors.passwordConfirmation ? "border-red-500" : ""
                      }
                    />
                    <Button
                      className="absolute right-0 bottom-0"
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setShowPasswordConfirmation(!showPasswordConfirmation)
                      }
                    >
                      {showPasswordConfirmation ? <EyeOffIcon /> : <EyeIcon />}
                    </Button>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#E70000] hover:bg-[#CC0000] col-span-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Alterando..." : "Alterar"}
                  </Button>
                </form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <p className="text-sm text-muted-foreground">
              Recomendamos alterar sua senha regularmente para manter sua conta
              segura.
            </p>
            <p className="text-sm text-muted-foreground">
              Sua conta foi criada em{" "}
              <span className="dark:text-white text-black">
                {desde.toLocaleDateString("pt-BR")}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
