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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
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
}

interface Props {
    user: User;
    roles: Role[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Usuarios',
        href: '/usuarios',
    },
    {
        title: 'Editar',
        href: '#',
    },
];

export default function Edit({ user, roles }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] =
        useState(false);
    const [changePassword, setChangePassword] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role_id: user.role_id?.toString() || '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/usuarios/${user.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Editar ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/usuarios">
                        <Button variant="outline" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">
                            Editar Usuario
                        </h1>
                        <p className="text-muted-foreground">
                            Modifica la información del usuario
                        </p>
                    </div>
                </div>

                {/* Form */}
                <div className="mx-auto w-full max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Usuario</CardTitle>
                            <CardDescription>
                                Actualiza los datos del usuario
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nombre */}
                                <div className="space-y-2">
                                    <Label htmlFor="name">
                                        Nombre Completo
                                        <span className="text-destructive">
                                            {' '}
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData('name', e.target.value)
                                        }
                                        placeholder="Ej: Juan Pérez"
                                        className={
                                            errors.name
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div className="space-y-2">
                                    <Label htmlFor="email">
                                        Correo Electrónico
                                        <span className="text-destructive">
                                            {' '}
                                            *
                                        </span>
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="ejemplo@correo.com"
                                        className={
                                            errors.email
                                                ? 'border-destructive'
                                                : ''
                                        }
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Rol */}
                                <div className="space-y-2">
                                    <Label htmlFor="role_id">
                                        Rol
                                        <span className="text-destructive">
                                            {' '}
                                            *
                                        </span>
                                    </Label>
                                    <Select
                                        value={data.role_id}
                                        onValueChange={(value) =>
                                            setData('role_id', value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.role_id
                                                    ? 'border-destructive'
                                                    : ''
                                            }
                                        >
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
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
                                    {errors.role_id && (
                                        <p className="text-sm text-destructive">
                                            {errors.role_id}
                                        </p>
                                    )}
                                </div>

                                {/* Cambiar contraseña */}
                                <div className="space-y-4 rounded-lg border p-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label>Cambiar Contraseña</Label>
                                            <p className="text-sm text-muted-foreground">
                                                Deja en blanco si no deseas
                                                cambiarla
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                setChangePassword(
                                                    !changePassword,
                                                )
                                            }
                                        >
                                            {changePassword
                                                ? 'Cancelar'
                                                : 'Cambiar'}
                                        </Button>
                                    </div>

                                    {changePassword && (
                                        <>
                                            {/* Nueva Contraseña */}
                                            <div className="space-y-2">
                                                <Label htmlFor="password">
                                                    Nueva Contraseña
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password"
                                                        type={
                                                            showPassword
                                                                ? 'text'
                                                                : 'password'
                                                        }
                                                        value={data.password}
                                                        onChange={(e) =>
                                                            setData(
                                                                'password',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Mínimo 8 caracteres"
                                                        className={
                                                            errors.password
                                                                ? 'border-destructive pr-10'
                                                                : 'pr-10'
                                                        }
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full px-3"
                                                        onClick={() =>
                                                            setShowPassword(
                                                                !showPassword,
                                                            )
                                                        }
                                                    >
                                                        {showPassword ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                                {errors.password && (
                                                    <p className="text-sm text-destructive">
                                                        {errors.password}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Confirmar Contraseña */}
                                            <div className="space-y-2">
                                                <Label htmlFor="password_confirmation">
                                                    Confirmar Nueva Contraseña
                                                </Label>
                                                <div className="relative">
                                                    <Input
                                                        id="password_confirmation"
                                                        type={
                                                            showPasswordConfirmation
                                                                ? 'text'
                                                                : 'password'
                                                        }
                                                        value={
                                                            data.password_confirmation
                                                        }
                                                        onChange={(e) =>
                                                            setData(
                                                                'password_confirmation',
                                                                e.target.value,
                                                            )
                                                        }
                                                        placeholder="Confirma tu contraseña"
                                                        className="pr-10"
                                                    />
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full px-3"
                                                        onClick={() =>
                                                            setShowPasswordConfirmation(
                                                                !showPasswordConfirmation,
                                                            )
                                                        }
                                                    >
                                                        {showPasswordConfirmation ? (
                                                            <EyeOff className="h-4 w-4" />
                                                        ) : (
                                                            <Eye className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </>
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
                                            : 'Actualizar Usuario'}
                                    </Button>
                                    <Link href="/usuarios" className="flex-1">
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
