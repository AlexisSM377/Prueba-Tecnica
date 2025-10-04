import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="h-screen mx-auto items-center justify-center flex-1">
                <h1 className="text-3xl font-bold tracking-tight">
                    Bienvenido al panel de administración de la aplicación
                    escolar
                </h1>
                <p className="text-muted-foreground mt-2 text-center">
                    Usa el menú lateral para navegar por las diferentes
                    secciones
                </p>
            </div>
        </AppLayout>
    );
}
