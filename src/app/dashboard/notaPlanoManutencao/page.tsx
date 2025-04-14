"use client";

import { deleteNotaPlanoManutencao } from "@/lib/actions/notaPlanoManutencao/deleteNotaPlanoManutencao";
import { fetchNotasPlanoManutencao } from "@/lib/actions/notaPlanoManutencao/fetchNotasPlanoManutencao";
import DataTable from "@/lib/components/DataTable";
import EntityLayout from "@/lib/components/EntityLayout";
import ModalWrapper from "@/lib/components/ModalWrapper";
import SearchAddRefreshBar from "@/lib/components/SearchAddRefreshBar";
import { NotaPlanoManutencao } from "@/lib/definitions/models/NotaPlanoManutencao";
import { useDisclosure, useToast } from "@chakra-ui/react";
import { useState } from "react";
import useSWR from "swr";
import NotaPlanoManutencaoForm from "./NotaPlanoManutencaoForm";
import ConfirmDeleteDialog from "@/lib/components/ConfirmDeleteDialog";

export default function NotaPMPage() {
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [editing, setEditing] = useState<NotaPlanoManutencao | null>(null);
  const [deleting, setDeleting] = useState<NotaPlanoManutencao | null>(null);
  const toast = useToast();

  const { data, error, isLoading, mutate } = useSWR<NotaPlanoManutencao[]>(
    "/api/notaPlanoManutencao",
    fetchNotasPlanoManutencao
  );
  const [filtered, setFiltered] = useState<NotaPlanoManutencao[]>([]);

  const handleDelete = async () => {
    const result = await deleteNotaPlanoManutencao(
      { success: true, messge: "" },
      deleting?.id || 0
    );

    if (result.success) {
      toast({
        title: result.message,
        status: "success",
      });
      onDeleteClose();
      mutate();
    } else {
      toast({
        title: result.message || "Erro ao deletar Nota PM",
        status: "error",
      });
    }
  };

  return (
    <EntityLayout
      title="Notas Plano de Manutenção"
      isLoading={isLoading}
      error={error}
    >
      <SearchAddRefreshBar
        searchPlaceholder="Pesquisar Nota"
        data={data || []}
        searchKey="nome"
        onFilter={setFiltered}
        onCreate={onCreateOpen}
        onRefresh={mutate}
        isRefreshing={isLoading}
      />

      <DataTable
        data={filtered.map((s) => ({ ...s, id: s.id || 0 }))}
        columns={[
          { key: "nome", label: "Nome" },
          { key: "numeroSAP", label: "Numero SAP" },
          { key: "status", label: "Status" },
        ]}
        onEdit={(item) => {
          setEditing(item);
          onEditOpen();
        }}
        onDelete={(item) => {
          setDeleting(item);
          onDeleteOpen();
        }}
      />

      <ModalWrapper
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        title="Nova Nota PM"
      >
        <NotaPlanoManutencaoForm
          onSuccess={() => {
            onCreateClose();
            mutate();
          }}
          notaPlanoManutencao={null}
        />
      </ModalWrapper>

      <ModalWrapper
        isOpen={isEditOpen}
        onClose={onEditClose}
        title="Editar Nota PM"
      >
        <NotaPlanoManutencaoForm
          onSuccess={() => {
            onEditClose();
            setEditing(null);
            mutate();
          }}
          notaPlanoManutencao={editing}
        />
      </ModalWrapper>

      <ConfirmDeleteDialog
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        onConfirm={handleDelete}
        entityName={deleting?.nome || ""}
      />
    </EntityLayout>
  );
}
