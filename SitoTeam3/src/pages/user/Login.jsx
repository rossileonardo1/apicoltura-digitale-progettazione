import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../App";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Login() {
  const nav = useNavigate();
  const { setUserAuthed } = useContext(AppContext);
  const [key, setKey] = useState("");

  return (
    <div className="min-h-[520px] flex items-center justify-center">
      <Card className="w-full max-w-[420px] border-white/10 bg-white/5 text-white">
        <CardContent className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <div className="text-3xl">🐝</div>
            <h1 className="text-lg font-semibold">Accesso</h1>
            <p className="text-xs text-white/60">
              Inserisci la key dell’arnia
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-white/70">Key Arnia</div>
            <input
              className="w-full h-11 rounded-xl border border-white/10 bg-white/5 px-3 text-sm text-white
                         focus:border-white/20 outline-none"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Es. A1"
            />
          </div>

          <Button
            className="w-full bg-amber-400 text-black hover:bg-amber-300"
            onClick={() => {
              setUserAuthed(true);
              nav("/user/home");
            }}
          >
            🔓 Accedi
          </Button>

          <Button
            variant="outline"
            className="w-full border-white/15 bg-white/5 text-white hover:bg-white/10"
            onClick={() => nav("/admin/access")}
          >
            🛠️ Accesso Admin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
