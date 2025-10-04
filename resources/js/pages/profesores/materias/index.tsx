import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, router } from "@inertiajs/react";
import { ArrowLeft, BookOpen, Plus, Trash2, UserCog } from "lucide-react";
import { useState } from "react";

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
}

interface Materia {
    id: number;
    nombre: string;
    descripcion: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    profesor: User;
    materias: Materia[]
}

export default function Index({ profesor, materias }: Props) {
    const [deleteDialog, setDeleteDialog] = useState<{
            open: boolean;
            materia: Materia | null;
    }>({ open: false, materia: null });
        
    const handleDelete = () => {
        if (deleteDialog.materia) {
            router.delete(`/profesores/${profesor.id}/materias/${deleteDialog.materia.id}`, {
                onSuccess: () => { 
                    setDeleteDialog({ open: false, materia: null });
                }
            })
        }
    }

    return (
        <AppLayout>
            <Head title={`Materias de ${profesor.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <Link href='/usuarios'>
                            <Button variant="outline" size="icon">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <div className="flex items-center gap-2">
                                <UserCog className="h-6 w-6" />
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {profesor.name}
                                </h1>
                            </div>
                            <p className="text-muted-foreground text-sm">
                                Gestionar materias del profesor
                            </p>
                        </div>
                    </div>
                    <Link href={`/profesores/${profesor.id}/materias/create`}>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Asignar Materia
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Información del Profesor</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Email:</span>
                            <span className="text-sm font-medium">{profesor.email}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-muted-foreground">Total de Materias:</span>
                            <Badge variant="default">{materias.length}</Badge>
                        </div>
                    </CardContent>
                </Card>
                {materias.length === 0 ? (
                     <Card className="flex flex-col items-center justify-center p-12">
                        <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="mb-2 text-lg font-semibold">
                            No hay materias asignadas a este profesor.
                        </h3>
                        <p className="mb-4 text-center text-sm text-muted-foreground">
                            Este profesor aún no tiene materias asignadas
                        </p>
                        <Link href={`/profesores/${profesor.id}/materias/create`}>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Asignar Primera Materia
                            </Button>
                        </Link>
                    </Card>
                ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {materias.map((materia) => (
                                <Card key={materia.id} className="group relative transition-all hover:shadow-md">
                                    <CardHeader>
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                <BookOpen className="h-5 w-5 text-primary" />
                                                <CardTitle className="text-lg">
                                                    {materia.nombre}
                                                </CardTitle>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
                                                onClick={() =>
                                                    setDeleteDialog({ open: true, materia })
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                        {materia.descripcion && (
                                            <CardDescription className="line-clamp-2">
                                                {materia.descripcion}
                                            </CardDescription>
                                        )}
                                    </CardHeader>
                                </Card>
                            ))}
                        </div>
                )}
            </div>

            <AlertDialog
                open={deleteDialog.open}
                onOpenChange={(open) => 
                    setDeleteDialog({ open, materia: deleteDialog.materia })
                }
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            ¿Desasignar materia?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            ¿Estás seguro de que deseas desasignar la materia "
                            {deleteDialog.materia?.nombre}" de {profesor.name}? Esta acción
                            no se puede deshacer.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Desasignar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AppLayout>
    )
}