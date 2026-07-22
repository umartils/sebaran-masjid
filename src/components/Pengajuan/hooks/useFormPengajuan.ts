import { useEffect,useState } from "react";
import { Session } from "next-auth";

import { initialForm  } from "../constants/initialForm";

interface UseFormPengajuanProps {
    session: Session | null
}

type FormPengajuan = typeof initialForm & {
  namaRelawan: string;
  noTelpRelawan: string;
  userId: string;
};

export function useFormPengajuan({ session }: UseFormPengajuanProps) {
  const [form, setForm] = useState<FormPengajuan>({
    ...initialForm,
    namaRelawan: "",
    noTelpRelawan: "",
    userId: "",
  });

  useEffect(() => {
    if (!session?.user) return;

    setForm((prev) => ({
      ...prev,
      namaRelawan: session.user.name ?? session.user.email ?? "",
      noTelpRelawan: session.user.nomorTelepon ?? session.user.email ?? "",
      userId: session.user.id,
    }));
  }, [session]);

  function setField(name: keyof typeof form, value: string) {
    setForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      // reset wilayah berantai
      if (name === "idProvinsi") {
        next.idKota = "";
        next.idKecamatan = "";
        next.idDesa = "";
      }

      if (name === "idKota") {
        next.idKecamatan = "";
        next.idDesa = "";
      }

      if (name === "idKecamatan") {
        next.idDesa = "";
      }

      return next;
    });
  }

  function resetForm() {
    setForm({
      ...initialForm,
      namaRelawan: session?.user?.name ?? session?.user?.email ?? "",

      noTelpRelawan: session?.user?.nomorTelepon ?? session?.user?.email ?? "",

      userId: session?.user?.id ?? "",
    });
  }

  return {
    form,
    setForm,
    setField,
    resetForm,
  };
}