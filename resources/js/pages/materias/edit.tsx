import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Materia {
    id: number;
    nombre: string;
    descripcion: string | null;
}

interface Props {
    materia: Materia;
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
    {
        title: 'Editar',
        href: '#',
    },
];

export default function Edit({ materia }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        nombre: materia.nombre,
        descripcion: materia.descripcion || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/materias/${materia.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${materia.nombre}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/materias">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Editar Materia
                        </h1>
                        <p className="text-muted-foreground">
                            Modifica la información de la materia
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="mx-auto w-full max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Materia</CardTitle>
                            <CardDescription>
                                Actualiza los datos de la materia
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nombre */}
                                <div className="space-y-2">
                                    <Label htmlFor="nombre">
                                        Nombre de la Materia
                                        <span className="text-destructive">
                                            {' '}
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="nombre"
                                        value={data.nombre}
                                        onChange={(e) =>
                                            setData('nombre', e.target.value)
                                        }
                                        placeholder="Ej: Matemáticas"
                                        className={
                                            errors.nombre ? 'border-destructive' : ''
                                        }
                                    />
                                    {errors.nombre && (
                                        <p className="text-sm text-destructive">
                                            {errors.nombre}
                                        </p>
                                    )}
                                </div>

                                {/* Descripción */}
                                <div className="space-y-2">
                                    <Label htmlFor="descripcion">
                                        Descripción
                                    </Label>
                                    <textarea
                                        id="descripcion"
                                        value={data.descripcion}
                                        onChange={(e) =>
                                            setData(
                                                'descripcion',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Descripción de la materia..."
                                        rows={4}
                                        className={`flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                                            errors.descripcion
                                                ? 'border-destructive'
                                                : ''
                                        }`}
                                    />
                                    {errors.descripcion && (
                                        <p className="text-sm text-destructive">
                                            {errors.descripcion}
                                        </p>
                                    )}
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-4">
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="flex-1"
                                    >
                                        {processing
                                            ? 'Actualizando...'
                                            : 'Actualizar Materia'}
                                    </Button>
                                    <Link href="/materias" className="flex-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Cancelar
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
