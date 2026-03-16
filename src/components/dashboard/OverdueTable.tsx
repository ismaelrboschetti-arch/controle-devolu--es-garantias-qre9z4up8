import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProcessStore } from "@/contexts/ProcessContext";
import { StatusBadge } from "../StatusBadge";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";

export function OverdueTable() {
  const { processes } = useProcessStore();
  const overdue = processes.filter(p => p.slaDays > 60 && p.status !== 'Crédito Liberado' && p.status !== 'Finalizado').sort((a, b) => b.slaDays - a.slaDays);

  if (overdue.length === 0) return null;

  return (
    <Card className="border-amber-200 shadow-sm bg-amber-50/30">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="text-amber-500 w-5 h-5" />
          <CardTitle className="text-lg text-amber-900">Alerta de Antecipação de Crédito (> 60 dias)</CardTitle>
        </div>
        <CardDescription>Processos que excederam o prazo legal e necessitam de crédito antecipado ao cliente.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Processo</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fornecedor</TableHead>
              <TableHead>Status Atual</TableHead>
              <TableHead className="text-right">Dias Corridos</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {overdue.map((p) => (
              <TableRow key={p.id} className="bg-white hover:bg-slate-50 transition-colors">
                <TableCell className="font-medium">
                  <Link to={`/processos/${p.id}`} className="text-brand-blue hover:underline">{p.id}</Link>
                </TableCell>
                <TableCell>{p.customer}</TableCell>
                <TableCell>{p.supplier}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell className="text-right font-bold text-amber-600 animate-pulse">{p.slaDays} dias</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
