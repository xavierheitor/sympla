"use client";

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { fetchKpis } from "@/lib/actions/kpi/fetchKpis";
import { fetchNotasPlanoManutencao } from "@/lib/actions/notaPlanoManutencao/fetchNotasPlanoManutencao";
import { fetchTipoManutencao } from "@/lib/actions/tipoManutencao/fetchTipoManutencao";
import { fetchSubestacoes } from "@/lib/actions/subestacao/fetchSubestacao";
import { editNotaPlanoManutencao } from "@/lib/actions/notaPlanoManutencao/editNotaPlanoManutencao";
import { newNotaPlanoManutencao } from "@/lib/actions/notaPlanoManutencao/newNotaPlanoManutencao";
import { ActionResult } from "@/lib/definitions/default/ActionResult";
import { NotaPlanoManutencao } from "@/lib/definitions/models/NotaPlanoManutencao";
import { TipoManutencao } from "@/lib/definitions/models/TipoManutencao";
import { Kpi } from "@/lib/definitions/models/Kpi";
import { Subestacao } from "@/lib/definitions/models/Subestacao";
import { Equipamento } from "@/lib/definitions/models/Equipamento";
import { SelectField } from "@/lib/components/SelectField";
import { fetchEquipamentos } from "@/lib/actions/equipamento/fetchEquipamentos";

interface NotaPlanoManutencaoFormProps {
  notaPlanoManutencao?: NotaPlanoManutencao | null;
  onSuccess: () => void;
}

export default function NotaPlanoManutencaoForm({
  notaPlanoManutencao,
  onSuccess,
}: NotaPlanoManutencaoFormProps) {
  const toast = useToast();

  const { data: subestacoes } = useSWR<Subestacao[]>(
    "/api/subestacoes",
    fetchSubestacoes
  );
  const { data: tiposManutencao } = useSWR<TipoManutencao[]>(
    "/api/tipoManutencao",
    fetchTipoManutencao
  );
  const { data: kpis } = useSWR<Kpi[]>("/api/kpi", fetchKpis);
  const { data: equipamentos } = useSWR<Equipamento[]>(
    "/api/equipamentos",
    fetchEquipamentos
  );

  const [formData, setFormData] = useState<Partial<NotaPlanoManutencao>>({});
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (notaPlanoManutencao) {
      setFormData(notaPlanoManutencao);
    }
  }, [notaPlanoManutencao]);

  const handleChange = (field: keyof NotaPlanoManutencao, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: [] }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setErrors({});

    const form = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        form.append(key, value.toString());
      }
    });

    const action = notaPlanoManutencao
      ? editNotaPlanoManutencao
      : newNotaPlanoManutencao;

    const result: ActionResult = await action(
      { success: true, message: "" },
      form
    );

    if (result.success) {
      toast({
        title: result.message,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSuccess();
    } else {
      setErrors(result.errors ?? {});
      toast({
        title: result.message || "Erro ao salvar",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    setLoading(false);
  };

  return (
    <Box
      as="form"
      onSubmit={(e: { preventDefault: () => void }) => {
        e.preventDefault();
        handleSubmit();
      }}
    >
      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!errors["nome"]}>
          <FormLabel>Nome</FormLabel>
          <Input
            value={String(formData["nome"] || "")}
            onChange={(e) => handleChange("nome", e.target.value)}
          />
        </FormControl>

        <FormControl isInvalid={!!errors["numeroSAP"]}>
          <FormLabel>Número SAP</FormLabel>
          <Input
            value={String(formData["numeroSAP"] || "")}
            onChange={(e) => handleChange("numeroSAP", e.target.value)}
          />
        </FormControl>

        <SelectField
          label="Status"
          value={String(formData["status"] || "")}
          onChange={(value) => handleChange("status", value)}
          options={getEnumOptions("status").map((val) => ({
            value: val,
            label: val,
          }))}
          placeholder="Selecione o status"
          error={!!errors["status"]}
        />

        <SelectField
          label="Tipo da Nota"
          value={String(formData["tipoNota"] || "")}
          onChange={(value) => handleChange("tipoNota", value)}
          options={getEnumOptions("tipoNota").map((val) => ({
            value: val,
            label: val,
          }))}
          placeholder="Selecione o tipo da nota"
          error={!!errors["tipoNota"]}
        />

        <SelectField
          label="Subestação"
          value={formData.subestacaoId?.toString() || ""}
          onChange={(value) => handleChange("subestacaoId", value)}
          options={(subestacoes || []).map((s) => ({
            value: s.id!.toString(),
            label: s.nome,
          }))}
          placeholder="Selecione a subestação"
          error={!!errors["subestacaoId"]}
        />

        <SelectField
          label="Equipamento"
          value={formData.equipamentoId?.toString() || ""}
          onChange={(value) => handleChange("equipamentoId", value)}
          options={(equipamentos || []).map((e) => ({
            value: e.id.toString(),
            label: e.nome,
          }))}
          placeholder="Selecione o equipamento"
          error={!!errors["equipamentoId"]}
        />

        <SelectField
          label="Tipo de Manutenção"
          value={formData.tipoManutencaoId?.toString() || ""}
          onChange={(value) => handleChange("tipoManutencaoId", value)}
          options={(tiposManutencao || []).map((t) => ({
            value: t.id.toString(),
            label: t.nome,
          }))}
          placeholder="Selecione o tipo de manutenção"
          error={!!errors["tipoManutencaoId"]}
        />

        <SelectField
          label="KPI"
          value={formData.kpiId?.toString() || ""}
          onChange={(value) => handleChange("kpiId", value)}
          options={(kpis || []).map((k) => ({
            value: k.id.toString(),
            label: k.nome,
          }))}
          placeholder="Selecione o KPI"
          error={!!errors["kpiId"]}
        />

        <Button type="submit" colorScheme="blue" isLoading={loading}>
          {notaPlanoManutencao ? "Atualizar Nota" : "Criar Nota"}
        </Button>
      </VStack>
    </Box>
  );

  function getEnumOptions(field: string): string[] {
    const enums: Record<string, string[]> = {
      status: ["PENDENTE", "PROGRAMADO", "EXECUTADO", "BAIXADO_NO_SAP"],
      tipoNota: ["TS", "AA", "RSF"],
    };
    return enums[field] || [];
  }
}
