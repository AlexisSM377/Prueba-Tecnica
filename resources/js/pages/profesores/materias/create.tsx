import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import { Head, Link, useForm } from "@inertiajs/react";
import { ArrowLeft, BookOpen, UserCog } from "lucide-react";

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
}

interface Props {
    profesor: User;
    materias: Materia[]
}


export default function Create({ profesor, materias }: Props) {
    const { data, setData, post, processing, errors } = useForm<{
        materia_ids: number[];
    }>({
        materia_ids: [],
    });
    
    const handleCheckboxChange = (materiaId: number, checked: boolean) => {
        if (checked) {
            setData('materia_ids', [...data.materia_ids, materiaId])
        } else {
            setData(
                'materia_ids',
                data.materia_ids.filter((id) => id !== materiaId)
            )
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(`/profesores/${profesor.id}/materias`);
    }
    
    return (
        <AppLayout>
            <Head title={`Asignar materias a ${profesor.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                <div className="flex items-center gap-4">
                    <Link href={`/profesores/${profesor.id}/materias`}>
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <div className="flex items-center gap-2">
                            <UserCog className="h-6 w-6" />
                            <h1 className="text-3xl font-bold tracking-tight">
                                Asignar Materias
                            </h1>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Seleccionar las materias para el alumno {profesor.name}
                        </p>
                    </div>
                </div>

                <div className="mx-auto w-full max-w-3xl">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Materias Disponibles</CardTitle>
                                <CardDescription>
                                    Selecciona una o más materias para asignar al profesor
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {materias.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <BookOpen className="mb-4 h-12 w-12 text-muted-foreground" />
                                        <h3 className="mb-2 text-lg font-semibold">
                                            No hay materias disponibles
                                        </h3>
                                        <p className="mb-4 text-center text-sm text-muted-foreground">
                                            Todas las materias ya están asignadas a este profesor o no existen materias en el sistema.
                                        </p>
                                        <Link href="/materias/create">
                                            <Button variant='outline'>
                                                Crear Nueva Materia
                                            </Button>
                                        </Link>
                                    </div>
                                ) : (
                                        <div className="space-y-4">
                                            {materias.map((materia) => (
                                                <div
                                                    key={materia.id}
                                                    className="flex items-start space-x-3 rounded-lg border p-4 transition-colors hover:bg-accent"
                                                >
                                                    <Checkbox
                                                        id={`materia-${materia.id}`}
                                                        checked={data.materia_ids.includes(materia.id)}
                                                        onCheckedChange={(checked) => handleCheckboxChange(materia.id, checked as boolean)}
                                                    />
                                                    <div className="flex-1">
                                                        <Label
                                                            htmlFor={`materia-${materia.id}`}
                                                            className="cursor-pointer text-base font-medium"
                                                        >
                                                            {materia.nombre}
                                                        </Label>
                                                        {materia.descripcion && (
                                                            <p className="text-sm text-muted-foreground">
                                                                {materia.descripcion}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                            {errors.materia_ids && (
                                                <p className="text-sm text-destructive">
                                                    {errors.materia_ids}
                                                </p>
                                            )}
                                        </div>
                                )}
                            </CardContent>
                        </Card>
                        
                        {materias.length > 0 && (
                            <div className="flex justify-end space-x-2">
                                <Link href={`/profesores/${profesor.id}/materias`}>
                                    <Button variant='outline' type="button">
                                        Cancelar
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing || data.materia_ids.length === 0}
                                >
                                    Asignar Materias ({data.materia_ids.length})
                                </Button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </AppLayout>
    )
}