import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { BookOpen, Edit, Plus, Trash2, Users, GraduationCap } from 'lucide-react';
import { useState } from 'react';

interface Materia {
    id: number;
    nombre: string;
    descripcion: string | null;
    alumnos_count?: number;
    profesores_count?: number;
    created_at: string;
    updated_at: string;
}

interface Props {
    materias: Materia[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
    {
        title: 'Materias',
        href: '/materias',
    },
];

export default function Index({ materias }: Props) {
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        materia: Materia | null;
    }>({ open: false, materia: null });

    const handleDelete = () => {
        if (deleteDialog.materia) {
            router.delete(`/materias/${deleteDialog.materia.id}`, {
                onSuccess: () => {
                    setDeleteDialog({ open: false, materia: null });
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Materias" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Materias
                        </h1>
                        <p className="text-muted-foreground">
                            Gestiona las materias del sistema escolar
                        </p>
                    </div>
                    <Link href="/materias/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Materia
                        </Button>
                    </Link>
                </div>

                {/* Cards Grid */}
                {materias.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-10">
                            <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-semibold">
                                No hay materias
                            </h3>
                            <p className="mb-4 text-center text-sm text-muted-foreground">
                                Comienza creando tu primera materia
                            </p>
                            <Link href="/materias/create">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Crear Materia
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {materias.map((materia) => (
                            <Card key={materia.id} className="overflow-hidden">
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                                                <BookOpen className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {materia.nombre}
                                                </CardTitle>
                                            </div>
                                        </div>
                                    </div>
                                    {materia.descripcion && (
                                        <CardDescription className="mt-2 line-clamp-2">
                                            {materia.descripcion}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <GraduationCap className="h-4 w-4" />
                                            <span>
                                                {materia.alumnos_count || 0}{' '}
                                                alumnos
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            <span>
                                                {materia.profesores_count || 0}{' '}
                                                profesores
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/materias/${materia.id}/edit`}
                                            className="flex-1"
                                        >
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                            >
                                                <Edit className="mr-2 h-4 w-4" />
                                                Editar
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setDeleteDialog({
                                                    open: true,
                                                    materia,
                                                })
                                            }
                                            className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Delete Dialog */}
            <Dialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    setDeleteDialog({ open, materia: null })
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Eliminar materia?</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar la materia "
                            {deleteDialog.materia?.nombre}"? Esta acción no se
                            puede deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteDialog({ open: false, materia: null })
                            }
                        >
                            Cancelar
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Eliminar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
