import { useState } from 'react';
import { 
  ScanLine, 
  User, 
  ChevronDown, 
  FileCode,
  Shield,
  GraduationCap,
  Users
} from 'lucide-react';
import { UserRole } from '../types';
import { VenezuelaFlagBar } from './VenezuelaFlagBar';

interface HeaderProps {
  currentRole: UserRole;
  currentEmail: string;
  onRoleChange: (role: UserRole, email: string) => void;
  activeTab: 'menu' | 'profesores' | 'nutricion' | 'cuenta' | 'admin';
  onTabChange: (tab: 'menu' | 'profesores' | 'nutricion' | 'cuenta' | 'admin') => void;
  onOpenScanner: () => void;
  onOpenPromptDoc: () => void;
}

export function Header({
  currentRole,
  currentEmail,
  onRoleChange,
  activeTab,
  onTabChange,
  onOpenScanner,
  onOpenPromptDoc
}: HeaderProps) {
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const ROLES = [
    { 
      role: 'admin' as UserRole, 
      label: 'Super Admin (Daniel Cárdenas)', 
      email: 'cardenas.gamboa@gmail.com',
      badge: 'Admin Autorizado' 
    },
    { 
      role: 'admin' as UserRole, 
      label: 'Admin (Chago López)', 
      email: 'chagolopez@gmail.com',
      badge: 'Admin Autorizado' 
    },
    { 
      role: 'teacher' as UserRole, 
      label: 'Prof. Carlos Mendoza', 
      email: 'carlos.mendoza@colegio.edu.ve',
      badge: 'Docente' 
    },
    { 
      role: 'parent' as UserRole, 
      label: 'Mariana Gamboa (Representante)', 
      email: 'mariana.gamboa@gmail.com',
      badge: 'Representante' 
    },
    { 
      role: 'student' as UserRole, 
      label: 'Santiago González (Alumno 4to A)', 
      email: 'santiago.est@colegio.edu.ve',
      badge: 'Carnet CANTINA-EST-101' 
    }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Venezuelan Flag Accent */}
      <VenezuelaFlagBar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* ZONE 1: Brand Wordmark (Single text element in display face) */}
        <div className="flex items-center gap-3">
          <a 
            href="#" 
            onClick={(e) => { e.preventDefault(); onTabChange('menu'); }}
            className="text-xl sm:text-2xl font-black tracking-tight text-stone-900 font-display flex items-center gap-1.5"
          >
            <span>Mi Cantina</span>
            <span className="text-xs font-sans font-bold px-1.5 py-0.5 rounded-sm bg-amber-400 text-stone-950 uppercase tracking-wider">
              VE
            </span>
          </a>
        </div>

        {/* ZONE 2: 4-6 Clean Text Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-stone-600">
          <button
            type="button"
            onClick={() => onTabChange('menu')}
            className={`transition-colors hover:text-stone-950 whitespace-nowrap ${
              activeTab === 'menu' ? 'text-amber-800 font-bold border-b-2 border-amber-500 py-1' : ''
            }`}
          >
            Menú Escolar
          </button>

          <button
            type="button"
            onClick={() => onTabChange('profesores')}
            className={`transition-colors hover:text-stone-950 whitespace-nowrap ${
              activeTab === 'profesores' ? 'text-amber-800 font-bold border-b-2 border-amber-500 py-1' : ''
            }`}
          >
            E-Commerce Docentes
          </button>

          <button
            type="button"
            onClick={() => onTabChange('nutricion')}
            className={`transition-colors hover:text-stone-950 whitespace-nowrap ${
              activeTab === 'nutricion' ? 'text-amber-800 font-bold border-b-2 border-amber-500 py-1' : ''
            }`}
          >
            Encuesta Nutricional
          </button>

          <button
            type="button"
            onClick={() => onTabChange('cuenta')}
            className={`transition-colors hover:text-stone-950 whitespace-nowrap ${
              activeTab === 'cuenta' ? 'text-amber-800 font-bold border-b-2 border-amber-500 py-1' : ''
            }`}
          >
            Mi Consumo & Pagos
          </button>

          <button
            type="button"
            onClick={() => onTabChange('admin')}
            className={`transition-colors hover:text-stone-950 whitespace-nowrap ${
              activeTab === 'admin' ? 'text-amber-800 font-bold border-b-2 border-amber-500 py-1' : ''
            }`}
          >
            Administración
          </button>
        </nav>

        {/* ZONE 3: 1-2 Primary Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Scanner Launcher */}
          <button
            type="button"
            onClick={onOpenScanner}
            className="py-1.5 px-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 shadow-2xs whitespace-nowrap"
          >
            <ScanLine className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Escanear Carnet</span>
          </button>

          {/* Master Prompt Inspector */}
          <button
            type="button"
            onClick={onOpenPromptDoc}
            title="Ver Prompt Maestro de Ingeniería y Esquema Firestore"
            className="p-2 border border-stone-300 hover:border-stone-400 text-stone-700 hover:text-stone-950 rounded-xl transition-colors bg-white"
          >
            <FileCode className="w-4 h-4 text-amber-600" />
          </button>

          {/* Role & User Switcher Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 py-1.5 px-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 transition-colors text-xs text-stone-800 font-semibold"
            >
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span className="hidden lg:inline truncate max-w-[130px]">
                {currentEmail}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-400" />
            </button>

            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 text-xs">
                <div className="px-3 py-2 border-b border-stone-100 mb-1">
                  <p className="font-bold text-stone-900">Simulación de Roles y Usuarios</p>
                  <p className="text-[11px] text-stone-400">Pruebe las reglas de negocio y restricciones:</p>
                </div>

                <div className="space-y-1">
                  {ROLES.map((r, i) => {
                    const isCurrent = currentEmail === r.email;
                    return (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          onRoleChange(r.role, r.email);
                          setShowRoleMenu(false);
                        }}
                        className={`w-full text-left p-2 rounded-xl transition-colors flex flex-col ${
                          isCurrent ? 'bg-amber-50 text-amber-950 font-bold' : 'hover:bg-stone-50 text-stone-700'
                        }`}
                      >
                        <span className="truncate">{r.label}</span>
                        <div className="flex items-center justify-between text-[10px] text-stone-400 font-normal mt-0.5">
                          <span className="font-mono truncate">{r.email}</span>
                          <span className="px-1.5 py-0.2 bg-stone-100 rounded text-stone-600">{r.badge}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-100 py-2 bg-stone-50 text-[11px] font-semibold text-stone-600">
        <button 
          onClick={() => onTabChange('menu')}
          className={activeTab === 'menu' ? 'text-amber-800 font-bold' : ''}
        >
          Menú
        </button>
        <button 
          onClick={() => onTabChange('profesores')}
          className={activeTab === 'profesores' ? 'text-amber-800 font-bold' : ''}
        >
          Docentes
        </button>
        <button 
          onClick={() => onTabChange('nutricion')}
          className={activeTab === 'nutricion' ? 'text-amber-800 font-bold' : ''}
        >
          Nutrición
        </button>
        <button 
          onClick={() => onTabChange('cuenta')}
          className={activeTab === 'cuenta' ? 'text-amber-800 font-bold' : ''}
        >
          Consumo
        </button>
        <button 
          onClick={() => onTabChange('admin')}
          className={activeTab === 'admin' ? 'text-amber-800 font-bold' : ''}
        >
          Admin
        </button>
      </div>
    </header>
  );
}
