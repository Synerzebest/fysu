import { Table, Button, Popconfirm } from "antd";
import type { ColumnsType } from "antd/es/table";
import Link from "next/link";
import type { PageRow } from "@/types/admin-pages";

type Props = {
  pages: PageRow[];
  loading: boolean;
  onDelete: (id: string) => void | Promise<void>;
  onAssign?: (page: PageRow) => void;
  onEdit?: (page: PageRow) => void;
};

export default function PagesTable({ pages, loading, onDelete, onAssign, onEdit }: Props) {
  const columns: ColumnsType<PageRow> = [
    { title: "Titre", dataIndex: "title" },
    {
      title: "Image",
      dataIndex: "hero_image",
      render: (url: PageRow["hero_image"]) =>
        url ? <img src={url} className="h-12" alt="" /> : "-",
    },
    {
      title: "Lien",
      render: (_: unknown, rec: PageRow) => (
        <Link href={`/${rec.slug}`}>{rec.slug}</Link>
      ),
    },
    {
      title: "Produits",
      render: (_: unknown, rec: PageRow) => (
        <Button onClick={() => onAssign?.(rec)}>
        Assigner
        </Button>
      ),
    },
    {
        title: "Actions",
        render: (_: unknown, rec: PageRow) => (
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
    <Table<PageRow>
      rowKey="id"
      dataSource={pages}
      columns={columns}
      loading={loading}
    />
  );
}