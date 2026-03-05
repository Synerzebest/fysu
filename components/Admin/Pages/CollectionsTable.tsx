import { Table, Button, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import type { CollectionRow } from "@/types/admin-pages";

type Props = {
  collections: CollectionRow[];
  loading: boolean;
  onDelete: (id: string) => void | Promise<void>;
  onAssign?: (collection: CollectionRow) => void;
  onEdit?: (collection: CollectionRow) => void;
};

export default function CollectionsTable({
  collections,
  loading,
  onDelete,
  onAssign,
  onEdit
}: Props) {
  const columns: ColumnsType<CollectionRow> = [
    { title: "Titre", dataIndex: "title" },
    {
      title: "Image",
      dataIndex: "hero_image",
      render: (url: CollectionRow["hero_image"]) =>
        url ? <img src={url} className="h-12" alt="" /> : "-",
    },
    {
      title: "Produits",
      render: (_: unknown, rec: CollectionRow) => (
        <Button onClick={() => onAssign?.(rec)}>
        Assigner
        </Button>
      ),
    },
    {
      title: "Lien",
      render: (_: unknown, rec: CollectionRow) => (
        <Link href={`/collections/${rec.slug}`}>{rec.slug}</Link>
      ),
    },
    {
        title: "Actions",
        render: (_: unknown, rec: CollectionRow) => (
          <>
            <Button onClick={() => onEdit?.(rec)}>Modifier</Button>
      
            <Popconfirm title="Supprimer ?" onConfirm={() => onDelete(rec.id)}>
              <Button danger>Supprimer</Button>
            </Popconfirm>
          </>
        ),
      }
  ];

  return (
    <Table<CollectionRow>
      rowKey="id"
      dataSource={collections}
      columns={columns}
      loading={loading}
    />
  );
}