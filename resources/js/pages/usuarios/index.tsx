import { Badge } from '@/components/ui/badge';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import {
    GraduationCap,
    Plus,
    Shield,
    Trash2,
    Users as UsersIcon,
    UserCog,
    BookOpen,
    Pencil,
} from 'lucide-react';
import { useState } from 'react';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role_id: number | null;
    role: Role | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    users: User[];
    roles: Role[];
    filters: {
        role_id?: string;
    };
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/usuarios',
    },
];

export default function Index({ users, roles, filters }: Props) {
    const [deleteDialog, setDeleteDialog] = useState<{
        open: boolean;
        user: User | null;
    }>({ open: false, user: null });

    const handleDelete = () => {
        if (deleteDialog.user) {
            router.delete(`/usuarios/${deleteDialog.user.id}`, {
                onSuccess: () => {
                    setDeleteDialog({ open: false, user: null });
                },
            });
        }
    };

    const handleFilterChange = (value: string) => {
        router.get(
            '/usuarios',
            { role_id: value === 'all' ? undefined : value },
            { preserveState: true },
        );
    };

    const getRoleIcon = (roleName: string | null | undefined) => {
        if (!roleName) return <UsersIcon className="h-5 w-5" />;
        
        switch (roleName) {
            case 'Alumno':
                return <GraduationCap className="h-5 w-5" />;
            case 'Profesor':
                return <UserCog className="h-5 w-5" />;
            case 'Administrador':
                return <Shield className="h-5 w-5" />;
            default:
                return <UsersIcon className="h-5 w-5" />;
        }
    };

    const getRoleBadgeVariant = (
        roleName: string | null | undefined,
    ): 'default' | 'secondary' | 'destructive' | 'outline' => {
        if (!roleName) return 'outline';
        
        switch (roleName) {
            case 'Alumno':
                return 'default';
            case 'Profesor':
                return 'secondary';
            case 'Administrador':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Usuarios" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Usuarios
                        </h1>
                        <p className="text-muted-foreground">
                            Gestiona alumnos, profesores de la plataforma educativa
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Select
                            value={filters.role_id || 'all'}
                            onValueChange={handleFilterChange}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Filtrar por rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                {roles.map((role) => (
                                    <SelectItem
                                        key={role.id}
                                        value={role.id.toString()}
                                    >
                                        {role.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Link href="/usuarios/create">
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Nuevo Usuario
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Usuarios Grid */}
                {users.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-10">
                            <UsersIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                            <h3 className="mb-2 text-lg font-semibold">
                                No hay usuarios
                            </h3>
                            <p className="mb-4 text-center text-sm text-muted-foreground">
                                {filters.role_id
                                    ? 'No se encontraron usuarios con el rol seleccionado'
                                    : 'Comienza creando tu primer usuario'}
                            </p>
                            {!filters.role_id && (
                                <Link href="/usuarios/create">
                                    <Button>
                                        <Plus className="mr-2 h-4 w-4" />
                                        Crear Usuario
                                    </Button>
                                </Link>
                            )}
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {users.map((user) => (
                            <Card key={user.id} className="group relative transition-all hover:shadow-md">
                                <CardHeader>
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start space-x-3">
                                            <div className="rounded-full bg-primary/10 p-2">
                                                {getRoleIcon(user.role?.name)}
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {user.name}
                                                </CardTitle>
                                                <CardDescription>
                                                    {user.email}
                                                </CardDescription>
                                                
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-between">
                                        <Badge
                                            variant={getRoleBadgeVariant(
                                                user.role?.name,
                                            )}
                                            
                                        >
                                            {user.role?.name || 'Sin Rol'}
                                        </Badge>
                                        <div className='flex gap-1 opacity-0 transition-opacity group-hover:opacity-100'>
                                            {/* Botón de Materias para Alumnos */}
                                            {user.role?.name === 'Alumno' && (
                                                <Link
                                                    href={`/alumnos/${user.id}/materias`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        title="Gestionar materias"
                                                    >
                                                        <BookOpen className="h-4 w-4 text-primary" />
                                                    </Button>
                                                </Link>
                                            )}

                                            {/* Botón de Materias para Profesores */}
                                            {user.role?.name === 'Profesor' && (
                                                <Link
                                                    href={`/profesores/${user.id}/materias`}
                                                >
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        title="Gestionar profesores"
                                                    >
                                                        <BookOpen className="h-4 w-4 text-primary" />
                                                    </Button>
                                                </Link>
                                            )}

                                            {/* Botón de Editar */}
                                            <Link
                                                href={`/usuarios/${user.id}/edit`}
                                            
                                            >
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    title="Editar usuario"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setDeleteDialog({
                                                        open: true,
                                                        user,
                                                    })
                                                }
                                                className="h-8 w-8"
                                                title="Eliminar usuario"
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
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
                onOpenChange={(open) => setDeleteDialog({ open, user: null })}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>¿Eliminar usuario?</DialogTitle>
                        <DialogDescription>
                            ¿Estás seguro de que deseas eliminar a "
                            {deleteDialog.user?.name}"? Esta acción no se puede
                            deshacer.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteDialog({ open: false, user: null })
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