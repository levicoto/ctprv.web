import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type Language = 'es' | 'en' | 'pt';

export interface PartnerTranslation {
  id: string;
  name: string;
  role: string;
  desc: string;
}

export interface TranslationDictionary {
  metaTitle: string;
  nav: {
    overview: string;
    services: string;
    backing: string;
    evaluation: string;
    cta: string;
    ariaMain: string;
    langSelectorAria: string;
  };
  hero: {
    kicker: [string, string, string];
    headline: string;
    body: string;
    primaryCta: string;
    padlockAria: string;
  };
  services: {
    headline: string;
    subtitle: string;
    shieldAria: string;
    argos: {
      tierTag: string;
      subtitleTag: string;
      name: string;
      audience: string;
      items: { title: string; desc: string }[];
      cta: string;
    };
    atlas: {
      tierTag: string;
      subtitleTag: string;
      name: string;
      audience: string;
      items: { title: string; desc: string }[];
      cta: string;
    };
  };
  tech: {
    headline: string;
    body: string;
    partners: PartnerTranslation[];
  };
  form: {
    headline: string;
    body: string;
    fields: {
      nameLabel: string;
      namePlaceholder: string;
      roleLabel: string;
      rolePlaceholder: string;
      refLabel: string;
      refPlaceholder: string;
      modeLabel: string;
      modeAria: string;
      soloOption: string;
      teamOption: string;
      concernLabel: string;
      optionalTag: string;
      concernPlaceholder: string;
      submitIdle: string;
      submitLoading: string;
    };
    validation: {
      errorPrefix: string;
      nameLength: (min: number, max: number) => string;
      roleLength: (min: number, max: number) => string;
      refEmpty: string;
      refInvalid: string;
      concernMax: (max: number) => string;
      idGenFailed: string;
      quotaExceeded: string;
      genericSubmitError: string;
    };
    confirmation: {
      title: string;
      folioLabel: string;
      tierLabel: string;
      nameLabel: string;
      roleLabel: string;
      refLabel: string;
      modeLabel: string;
      modeSoloDesc: string;
      modeTeamDesc: string;
      downloadBtn: string;
      emailBtn: string;
      resetBtn: string;
      tierDisplayArgos: string;
      tierDisplayAtlas: string;
      receiptHeader: string;
      receiptFolio: string;
      receiptDate: string;
      receiptName: string;
      receiptRole: string;
      receiptRef: string;
      receiptMode: string;
      receiptModeSolo: string;
      receiptModeTeam: string;
      receiptTier: string;
      receiptNotes: string;
      receiptNoNotes: string;
      mailSubjectPrefix: string;
    };
  };
  footer: {
    privateAccess: string;
  };
  admin: {
    dialogAria: string;
    headerTitle: string;
    exportCsv: string;
    signOut: string;
    closeAria: string;
    verifying: string;
    signInTitle: string;
    signInDesc: string;
    signInBtn: string;
    signInFailed: string;
    unauthorizedTitle: string;
    unauthorizedPrefix: string;
    unauthorizedMiddle: string;
    tabs: {
      all: (count: number) => string;
      pendiente: string;
      en_revision: string;
      contactado: string;
      cerrado: string;
    };
    statusLabels: {
      pendiente: string;
      en_revision: string;
      contactado: string;
      cerrado: string;
    };
    loadingDocs: string;
    emptyDocs: string;
    recentFallback: string;
    confirmDelete: string;
    cancelDelete: string;
    deleteAria: string;
    modeAndTier: string;
    soloShort: string;
    teamShort: string;
    refLink: string;
    reportedConcern: string;
    noComments: string;
    dossierStatus: string;
    closedLockedMsg: string;
    reopenBtn: string;
    internalNotesLabel: string;
    internalNotesPlaceholder: string;
    savingBtn: string;
    saveNotesBtn: string;
    feedbackSyncError: string;
    feedbackStatusUpdated: (label: string) => string;
    feedbackStatusError: string;
    feedbackNotesSaved: string;
    feedbackNotesError: string;
    feedbackDeleteError: string;
  };
}

const DICTIONARIES: Record<Language, TranslationDictionary> = {
  es: {
    metaTitle: 'Coto Privado — Safe, Trust, Cybersecurity',
    nav: {
      overview: 'Inicio',
      services: 'Servicios',
      backing: 'Respaldo',
      evaluation: 'Evaluación',
      cta: 'Solicitar Auditoría',
      ariaMain: 'Navegación principal',
      langSelectorAria: 'Seleccionar idioma',
    },
    hero: {
      kicker: ['Safe', 'Trust', 'Cybersecurity'],
      headline: 'Seguridad de grado corporativo simplificada para ti.',
      body: 'Protegemos el patrimonio digital, la identidad y las operaciones de fundadores, creadores y figuras públicas, para que te concentres en lo que mejor sabes hacer.',
      primaryCta: 'Solicitar Auditoría Privada',
      padlockAria: 'Candado de seguridad',
    },
    services: {
      headline: 'Nuestros Servicios',
      subtitle: 'Dos niveles de protección según la estructura de tu operación.',
      shieldAria: 'Escudo de seguridad',
      argos: {
        tierTag: 'Tier 1',
        subtitleTag: 'Cimiento Esencial',
        name: 'Argos',
        audience: 'Para profesionales independientes, fundadores y creadores de contenido.',
        items: [
          {
            title: 'Identidad Blindada',
            desc: 'Bóveda centralizada de contraseñas y correos alias para ocultar tu rastro.',
          },
          {
            title: 'Defensa Silenciosa',
            desc: 'Protección y parcheo automático de tus dispositivos (PC/Mac/Móvil) en segundo plano, sin interrumpir tu trabajo.',
          },
          {
            title: 'Diagnóstico de Exposición',
            desc: 'Auditoría inicial para detectar si tus datos ya están comprometidos en la web.',
          },
        ],
        cta: 'Elegir Argos',
      },
      atlas: {
        tierTag: 'Tier 2',
        subtitleTag: 'Blindaje Integral',
        name: 'Atlas',
        audience:
          'Para operaciones de alto perfil que requieren delegar accesos a equipos, agencias o colaboradores.',
        items: [
          {
            title: 'Delegación Zero-Knowledge',
            desc: 'Tu equipo inicia sesión en tus plataformas críticas sin ver jamás las contraseñas ni los códigos de seguridad (2FA).',
          },
          {
            title: 'Vigilancia Continua',
            desc: 'Monitoreo activo contra robo de sesiones, suplantación de identidad y rastreo de credenciales en la Dark Web.',
          },
          {
            title: 'Respuesta a Crisis (<30 min)',
            desc: 'Aislamiento remoto de dispositivos hackeados, canal de comunicación encriptado y dossier inmutable para el rescate rápido de cuentas.',
          },
        ],
        cta: 'Elegir Atlas',
      },
    },
    tech: {
      headline: 'Tecnología y Respaldo',
      body: 'Operamos bajo una arquitectura de confianza cero impulsada por líderes de la industria: Keeper, Cloudflare, ESET, Action1 e iVerify.',
      partners: [
        {
          id: 'keeper',
          name: 'Keeper',
          role: 'Bóveda criptográfica',
          desc: 'Cifrado a nivel de dispositivo para credenciales, llaves de acceso y secretos críticos.',
        },
        {
          id: 'cloudflare',
          name: 'Cloudflare',
          role: 'Perímetro y DNS privado',
          desc: 'Filtrado de red, túneles encriptados y bloqueo preventivo de dominios de phishing.',
        },
        {
          id: 'eset',
          name: 'ESET',
          role: 'Protección de endpoints',
          desc: 'Defensa antimalware ligera en macOS y Windows contra infostealers y troyanos.',
        },
        {
          id: 'action1',
          name: 'Action1',
          role: 'Gestión de vulnerabilidades',
          desc: 'Cierre autónomo de brechas en sistemas operativos, navegadores y aplicaciones.',
        },
        {
          id: 'iverify',
          name: 'iVerify',
          role: 'Integridad móvil',
          desc: 'Detección avanzada de spyware y endurecimiento de seguridad en iOS y Android.',
        },
      ],
    },
    form: {
      headline: 'Formulario de Evaluación',
      body: 'Completa estos datos esenciales —puedes usar un alias— para coordinar tu diagnóstico inicial. Nunca solicitamos contraseñas ni acceso a dispositivos en esta etapa.',
      fields: {
        nameLabel: 'Nombre / Alias',
        namePlaceholder: 'Ej. Martín V. o alias privado',
        roleLabel: 'Rol principal (Ej. Fundador, Creador, Consultor)',
        rolePlaceholder: 'Fundador, Creador, Figura pública...',
        refLabel: 'Enlace de referencia (Web de tu proyecto / Red social principal)',
        refPlaceholder: 'https://tuproyecto.com o @perfil',
        modeLabel: '¿Operas en solitario o delegas accesos a un equipo/agencia?',
        modeAria: 'Modalidad operativa',
        soloOption: 'Solo',
        teamOption: 'Equipo',
        concernLabel: '¿Tienes alguna preocupación de seguridad o incidente reciente?',
        optionalTag: 'Opcional',
        concernPlaceholder: 'Contexto breve si deseas compartirlo...',
        submitIdle: 'Solicitar Auditoría Privada',
        submitLoading: 'Enviando solicitud...',
      },
      validation: {
        errorPrefix: 'Error',
        nameLength: (min, max) => `Ingresa tu nombre o alias (${min} a ${max} caracteres).`,
        roleLength: (min, max) => `Especifica tu rol principal (${min} a ${max} caracteres).`,
        refEmpty: 'Comparte el enlace de tu proyecto o perfil principal.',
        refInvalid: 'Introduce un dominio válido (ej. tuproyecto.com) o usuario (ej. @usuario).',
        concernMax: (max) => `Máximo ${max} caracteres.`,
        idGenFailed: 'No fue posible generar un identificador seguro. Intenta nuevamente.',
        quotaExceeded:
          'Se alcanzó el límite diario de base de datos. Intenta mañana o contacta por correo.',
        genericSubmitError:
          'Ocurrió un inconveniente al registrar tu solicitud. Verifica tu conexión e inténtalo de nuevo.',
      },
      confirmation: {
        title: 'Auditoría Privada Registrada',
        folioLabel: 'Folio',
        tierLabel: 'Nivel asignado',
        nameLabel: 'Nombre / Alias',
        roleLabel: 'Rol principal',
        refLabel: 'Enlace de referencia',
        modeLabel: 'Modalidad',
        modeSoloDesc: 'Solo',
        modeTeamDesc: 'Equipo',
        downloadBtn: 'Descargar comprobante',
        emailBtn: 'Notificar por correo',
        resetBtn: 'Nueva solicitud',
        tierDisplayArgos: 'Tier 1: Argos',
        tierDisplayAtlas: 'Tier 2: Atlas',
        receiptHeader: 'COTO PRIVADO — AUDITORÍA PRIVADA',
        receiptFolio: 'Folio',
        receiptDate: 'Fecha',
        receiptName: 'Nombre / Alias',
        receiptRole: 'Rol principal',
        receiptRef: 'Referencia',
        receiptMode: 'Modalidad',
        receiptModeSolo: 'Solo',
        receiptModeTeam: 'Equipo',
        receiptTier: 'Nivel',
        receiptNotes: 'Notas',
        receiptNoNotes: 'Sin incidentes reportados',
        mailSubjectPrefix: 'Auditoría Privada',
      },
    },
    footer: {
      privateAccess: 'Acceso Privado',
    },
    admin: {
      dialogAria: 'Panel privado de evaluaciones Coto Privado',
      headerTitle: 'Solicitudes — Coto Privado',
      exportCsv: 'Exportar CSV',
      signOut: 'Salir',
      closeAria: 'Cerrar panel',
      verifying: 'Verificando credenciales...',
      signInTitle: 'Acceso Administrativo',
      signInDesc: 'Inicia sesión con la cuenta autorizada para gestionar las solicitudes.',
      signInBtn: 'Autenticar con Google',
      signInFailed: 'No se pudo completar el inicio de sesión con Google.',
      unauthorizedTitle: 'Cuenta sin permisos',
      unauthorizedPrefix: 'La sesión actual',
      unauthorizedMiddle: 'no tiene acceso. Inicia sesión con',
      tabs: {
        all: (count) => `Todas (${count})`,
        pendiente: 'Pendientes',
        en_revision: 'En revisión',
        contactado: 'Contactados',
        cerrado: 'Cerrados',
      },
      statusLabels: {
        pendiente: 'Pendiente',
        en_revision: 'En revisión',
        contactado: 'Contactado',
        cerrado: 'Cerrado',
      },
      loadingDocs: 'Cargando solicitudes...',
      emptyDocs: 'No hay solicitudes registradas todavía.',
      recentFallback: 'Reciente',
      confirmDelete: 'Confirmar borrado',
      cancelDelete: 'Cancelar',
      deleteAria: 'Eliminar solicitud',
      modeAndTier: 'Modalidad y Nivel',
      soloShort: 'Solo',
      teamShort: 'Equipo',
      refLink: 'Referencia',
      reportedConcern: 'Preocupación o incidente',
      noComments: 'Sin comentarios adicionales.',
      dossierStatus: 'Estado',
      closedLockedMsg: 'Expediente cerrado.',
      reopenBtn: 'Reabrir',
      internalNotesLabel: 'Notas internas',
      internalNotesPlaceholder: 'Observaciones de seguimiento...',
      savingBtn: 'Guardando...',
      saveNotesBtn: 'Guardar notas',
      feedbackSyncError: 'No fue posible sincronizar las solicitudes.',
      feedbackStatusUpdated: (label) => `Estado actualizado a ${label}.`,
      feedbackStatusError: 'Error al actualizar el estado.',
      feedbackNotesSaved: 'Notas guardadas.',
      feedbackNotesError: 'No se pudieron guardar las notas.',
      feedbackDeleteError: 'No fue posible eliminar el registro.',
    },
  },

  en: {
    metaTitle: 'Coto Privado — Safe, Trust, Cybersecurity',
    nav: {
      overview: 'Overview',
      services: 'Services',
      backing: 'Technology',
      evaluation: 'Assessment',
      cta: 'Request Audit',
      ariaMain: 'Primary navigation',
      langSelectorAria: 'Select language',
    },
    hero: {
      kicker: ['Safe', 'Trust', 'Cybersecurity'],
      headline: 'Corporate-grade security simplified for you.',
      body: 'We protect the digital wealth, identity, and operations of founders, creators, and public figures, so you can focus on what you do best.',
      primaryCta: 'Request Private Audit',
      padlockAria: 'Security padlock',
    },
    services: {
      headline: 'Our Services',
      subtitle: 'Two protection tiers structured around your operation.',
      shieldAria: 'Security shield',
      argos: {
        tierTag: 'Tier 1',
        subtitleTag: 'Essential Foundation',
        name: 'Argos',
        audience: 'For independent professionals, founders, and content creators.',
        items: [
          {
            title: 'Shielded Identity',
            desc: 'Centralized password vault and alias emails to conceal your digital footprint.',
          },
          {
            title: 'Silent Defense',
            desc: 'Automated protection and background patching across your devices (PC/Mac/Mobile) without interrupting your workflow.',
          },
          {
            title: 'Exposure Diagnostic',
            desc: 'Initial baseline audit to detect whether your personal data is already compromised online.',
          },
        ],
        cta: 'Select Argos',
      },
      atlas: {
        tierTag: 'Tier 2',
        subtitleTag: 'Comprehensive Shielding',
        name: 'Atlas',
        audience:
          'For high-profile operations that delegate access to teams, agencies, or collaborators.',
        items: [
          {
            title: 'Zero-Knowledge Delegation',
            desc: 'Your team logs into critical platforms without ever seeing your passwords or security codes (2FA).',
          },
          {
            title: 'Continuous Vigilance',
            desc: 'Active monitoring against session hijacking, impersonation, and Dark Web credential leaks.',
          },
          {
            title: 'Crisis Response (<30 min)',
            desc: 'Remote isolation of compromised devices, encrypted communication channel, and immutable recovery dossier.',
          },
        ],
        cta: 'Select Atlas',
      },
    },
    tech: {
      headline: 'Technology & Backing',
      body: 'We operate on a zero-trust architecture powered by industry leaders: Keeper, Cloudflare, ESET, Action1, and iVerify.',
      partners: [
        {
          id: 'keeper',
          name: 'Keeper',
          role: 'Cryptographic vault',
          desc: 'Device-level encryption for credentials, passkeys, and critical secrets.',
        },
        {
          id: 'cloudflare',
          name: 'Cloudflare',
          role: 'Perimeter & private DNS',
          desc: 'Network filtering, encrypted tunnels, and preemptive phishing domain blocking.',
        },
        {
          id: 'eset',
          name: 'ESET',
          role: 'Endpoint protection',
          desc: 'Lightweight anti-malware defense on macOS and Windows against infostealers.',
        },
        {
          id: 'action1',
          name: 'Action1',
          role: 'Vulnerability management',
          desc: 'Autonomous security updates across operating systems, browsers, and apps.',
        },
        {
          id: 'iverify',
          name: 'iVerify',
          role: 'Mobile integrity',
          desc: 'Advanced spyware detection and system hardening for iOS and Android.',
        },
      ],
    },
    form: {
      headline: 'Assessment Form',
      body: 'Complete these essential details—you may use an alias—to coordinate your initial diagnostic. We never request passwords or device access at this stage.',
      fields: {
        nameLabel: 'Name / Alias',
        namePlaceholder: 'E.g. Martin V. or private alias',
        roleLabel: 'Primary role (E.g. Founder, Creator, Consultant)',
        rolePlaceholder: 'Founder, Creator, Public Figure...',
        refLabel: 'Reference link (Project website / Main social profile)',
        refPlaceholder: 'https://yourproject.com or @handle',
        modeLabel: 'Do you operate solo or delegate access to a team/agency?',
        modeAria: 'Operating mode',
        soloOption: 'Solo',
        teamOption: 'Team',
        concernLabel: 'Do you have any security concern or recent incident?',
        optionalTag: 'Optional',
        concernPlaceholder: 'Brief context if you wish to share...',
        submitIdle: 'Request Private Audit',
        submitLoading: 'Submitting request...',
      },
      validation: {
        errorPrefix: 'Error',
        nameLength: (min, max) => `Enter your name or alias (${min} to ${max} characters).`,
        roleLength: (min, max) => `Specify your primary role (${min} to ${max} characters).`,
        refEmpty: 'Share your project website or primary social profile.',
        refInvalid: 'Enter a valid domain (e.g. yourproject.com) or handle (e.g. @handle).',
        concernMax: (max) => `Maximum ${max} characters.`,
        idGenFailed: 'Unable to generate a secure identifier. Please try again.',
        quotaExceeded: 'Daily database quota reached. Please try again tomorrow or contact via email.',
        genericSubmitError:
          'An issue occurred while saving your request. Check your connection and try again.',
      },
      confirmation: {
        title: 'Private Audit Registered',
        folioLabel: 'Reference',
        tierLabel: 'Assigned tier',
        nameLabel: 'Name / Alias',
        roleLabel: 'Primary role',
        refLabel: 'Reference link',
        modeLabel: 'Mode',
        modeSoloDesc: 'Solo',
        modeTeamDesc: 'Team',
        downloadBtn: 'Download receipt',
        emailBtn: 'Notify via email',
        resetBtn: 'New request',
        tierDisplayArgos: 'Tier 1: Argos',
        tierDisplayAtlas: 'Tier 2: Atlas',
        receiptHeader: 'COTO PRIVADO — PRIVATE AUDIT',
        receiptFolio: 'Reference',
        receiptDate: 'Date',
        receiptName: 'Name / Alias',
        receiptRole: 'Primary role',
        receiptRef: 'Link',
        receiptMode: 'Mode',
        receiptModeSolo: 'Solo',
        receiptModeTeam: 'Team',
        receiptTier: 'Tier',
        receiptNotes: 'Notes',
        receiptNoNotes: 'No recent incidents reported',
        mailSubjectPrefix: 'Private Audit',
      },
    },
    footer: {
      privateAccess: 'Private Access',
    },
    admin: {
      dialogAria: 'Coto Privado private assessments panel',
      headerTitle: 'Requests — Coto Privado',
      exportCsv: 'Export CSV',
      signOut: 'Sign out',
      closeAria: 'Close panel',
      verifying: 'Verifying credentials...',
      signInTitle: 'Administrative Access',
      signInDesc: 'Sign in with the authorized account to manage audit requests.',
      signInBtn: 'Authenticate with Google',
      signInFailed: 'Could not complete Google sign-in.',
      unauthorizedTitle: 'Unauthorized account',
      unauthorizedPrefix: 'The current session',
      unauthorizedMiddle: 'does not have access. Sign in with',
      tabs: {
        all: (count) => `All (${count})`,
        pendiente: 'Pending',
        en_revision: 'In review',
        contactado: 'Contacted',
        cerrado: 'Closed',
      },
      statusLabels: {
        pendiente: 'Pending',
        en_revision: 'In review',
        contactado: 'Contacted',
        cerrado: 'Closed',
      },
      loadingDocs: 'Loading requests...',
      emptyDocs: 'No requests recorded yet.',
      recentFallback: 'Just now',
      confirmDelete: 'Confirm delete',
      cancelDelete: 'Cancel',
      deleteAria: 'Delete request',
      modeAndTier: 'Mode & Tier',
      soloShort: 'Solo',
      teamShort: 'Team',
      refLink: 'Reference',
      reportedConcern: 'Concern or incident',
      noComments: 'No additional notes.',
      dossierStatus: 'Status',
      closedLockedMsg: 'Closed dossier.',
      reopenBtn: 'Reopen',
      internalNotesLabel: 'Internal notes',
      internalNotesPlaceholder: 'Follow-up notes...',
      savingBtn: 'Saving...',
      saveNotesBtn: 'Save notes',
      feedbackSyncError: 'Could not synchronize requests.',
      feedbackStatusUpdated: (label) => `Status updated to ${label}.`,
      feedbackStatusError: 'Failed to update status.',
      feedbackNotesSaved: 'Notes saved.',
      feedbackNotesError: 'Failed to save notes.',
      feedbackDeleteError: 'Failed to delete record.',
    },
  },

  pt: {
    metaTitle: 'Coto Privado — Safe, Trust, Cybersecurity',
    nav: {
      overview: 'Início',
      services: 'Serviços',
      backing: 'Tecnologia',
      evaluation: 'Avaliação',
      cta: 'Solicitar Auditoria',
      ariaMain: 'Navegação principal',
      langSelectorAria: 'Selecionar idioma',
    },
    hero: {
      kicker: ['Safe', 'Trust', 'Cybersecurity'],
      headline: 'Segurança de nível corporativo simplificada para você.',
      body: 'Protegemos o patrimônio digital, a identidade e as operações de fundadores, criadores e figuras públicas, para que você se concentre no que sabe fazer de melhor.',
      primaryCta: 'Solicitar Auditoria Privada',
      padlockAria: 'Cadeado de segurança',
    },
    services: {
      headline: 'Nossos Serviços',
      subtitle: 'Dois níveis de proteção conforme a estrutura da sua operação.',
      shieldAria: 'Escudo de segurança',
      argos: {
        tierTag: 'Tier 1',
        subtitleTag: 'Alicerce Essencial',
        name: 'Argos',
        audience: 'Para profissionais independentes, fundadores e criadores de conteúdo.',
        items: [
          {
            title: 'Identidade Blindada',
            desc: 'Cofre centralizado de senhas e e-mails alias para ocultar seu rastro digital.',
          },
          {
            title: 'Defesa Silenciosa',
            desc: 'Proteção e atualização automática dos seus dispositivos (PC/Mac/Celular) em segundo plano, sem interromper seu trabalho.',
          },
          {
            title: 'Diagnóstico de Exposição',
            desc: 'Auditoria inicial para detectar se seus dados já estão comprometidos na web.',
          },
        ],
        cta: 'Escolher Argos',
      },
      atlas: {
        tierTag: 'Tier 2',
        subtitleTag: 'Blindagem Integral',
        name: 'Atlas',
        audience:
          'Para operações de alto perfil que exigem delegar acessos a equipes, agências ou colaboradores.',
        items: [
          {
            title: 'Delegação Zero-Knowledge',
            desc: 'Sua equipe acessa plataformas críticas sem jamais visualizar senhas ou códigos de segurança (2FA).',
          },
          {
            title: 'Vigilância Contínua',
            desc: 'Monitoramento ativo contra sequestro de sessão, falsidade ideológica e vazamento de credenciais na Dark Web.',
          },
          {
            title: 'Resposta a Crises (<30 min)',
            desc: 'Isolamento remoto de dispositivos comprometidos, canal de comunicação criptografado e dossiê imutável para resgate rápido de contas.',
          },
        ],
        cta: 'Escolher Atlas',
      },
    },
    tech: {
      headline: 'Tecnologia e Respaldo',
      body: 'Operamos sob uma arquitetura de confiança zero impulsionada por líderes do setor: Keeper, Cloudflare, ESET, Action1 e iVerify.',
      partners: [
        {
          id: 'keeper',
          name: 'Keeper',
          role: 'Cofre criptográfico',
          desc: 'Criptografia local para credenciais, chaves de acesso e segredos críticos.',
        },
        {
          id: 'cloudflare',
          name: 'Cloudflare',
          role: 'Perímetro e DNS privado',
          desc: 'Filtragem de rede, túneis criptografados e bloqueio preventivo de phishing.',
        },
        {
          id: 'eset',
          name: 'ESET',
          role: 'Proteção de endpoints',
          desc: 'Defesa antimalware leve em macOS e Windows contra infostealers e trojans.',
        },
        {
          id: 'action1',
          name: 'Action1',
          role: 'Gestão de vulnerabilidades',
          desc: 'Correção autônoma de falhas em sistemas operacionais, navegadores e apps.',
        },
        {
          id: 'iverify',
          name: 'iVerify',
          role: 'Integridade móvel',
          desc: 'Detecção avançada de spyware e fortalecimento de segurança no iOS e Android.',
        },
      ],
    },
    form: {
      headline: 'Formulário de Avaliação',
      body: 'Preencha estes dados essenciais — você pode usar um alias — para coordenar seu diagnóstico inicial. Jamais solicitamos senhas ou acesso a dispositivos nesta etapa.',
      fields: {
        nameLabel: 'Nome / Alias',
        namePlaceholder: 'Ex.: Martín V. ou alias privado',
        roleLabel: 'Função principal (Ex.: Fundador, Criador, Consultor)',
        rolePlaceholder: 'Fundador, Criador, Figura pública...',
        refLabel: 'Link de referência (Site do projeto / Rede social principal)',
        refPlaceholder: 'https://seuprojeto.com ou @perfil',
        modeLabel: 'Você opera sozinho ou delega acessos a uma equipe/agência?',
        modeAria: 'Modalidade operacional',
        soloOption: 'Solo',
        teamOption: 'Equipe',
        concernLabel: 'Você tem alguma preocupação de segurança ou incidente recente?',
        optionalTag: 'Opcional',
        concernPlaceholder: 'Contexto breve, caso queira compartilhar...',
        submitIdle: 'Solicitar Auditoria Privada',
        submitLoading: 'Enviando solicitação...',
      },
      validation: {
        errorPrefix: 'Erro',
        nameLength: (min, max) => `Informe seu nome ou alias (${min} a ${max} caracteres).`,
        roleLength: (min, max) => `Especifique sua função principal (${min} a ${max} caracteres).`,
        refEmpty: 'Compartilhe o link do seu projeto ou perfil principal.',
        refInvalid: 'Insira um domínio válido (ex.: seuprojeto.com) ou usuário (ex.: @usuario).',
        concernMax: (max) => `Máximo de ${max} caracteres.`,
        idGenFailed: 'Não foi possível gerar um identificador seguro. Tente novamente.',
        quotaExceeded:
          'Limite diário do banco de dados atingido. Tente amanhã ou entre em contato por e-mail.',
        genericSubmitError:
          'Ocorreu um problema ao registrar sua solicitação. Verifique sua conexão e tente novamente.',
      },
      confirmation: {
        title: 'Auditoria Privada Registrada',
        folioLabel: 'Código',
        tierLabel: 'Nível atribuído',
        nameLabel: 'Nome / Alias',
        roleLabel: 'Função principal',
        refLabel: 'Link de referência',
        modeLabel: 'Modalidade',
        modeSoloDesc: 'Solo',
        modeTeamDesc: 'Equipe',
        downloadBtn: 'Baixar comprovante',
        emailBtn: 'Notificar por e-mail',
        resetBtn: 'Nova solicitação',
        tierDisplayArgos: 'Tier 1: Argos',
        tierDisplayAtlas: 'Tier 2: Atlas',
        receiptHeader: 'COTO PRIVADO — AUDITORIA PRIVADA',
        receiptFolio: 'Código',
        receiptDate: 'Data',
        receiptName: 'Nome / Alias',
        receiptRole: 'Função principal',
        receiptRef: 'Referência',
        receiptMode: 'Modalidade',
        receiptModeSolo: 'Solo',
        receiptModeTeam: 'Equipe',
        receiptTier: 'Nível',
        receiptNotes: 'Notas',
        receiptNoNotes: 'Nenhum incidente relatado',
        mailSubjectPrefix: 'Auditoria Privada',
      },
    },
    footer: {
      privateAccess: 'Acesso Privado',
    },
    admin: {
      dialogAria: 'Painel privado de avaliações Coto Privado',
      headerTitle: 'Solicitações — Coto Privado',
      exportCsv: 'Exportar CSV',
      signOut: 'Sair',
      closeAria: 'Fechar painel',
      verifying: 'Verificando credenciais...',
      signInTitle: 'Acesso Administrativo',
      signInDesc: 'Entre com a conta autorizada para gerenciar as solicitações.',
      signInBtn: 'Autenticar com Google',
      signInFailed: 'Não foi possível concluir o login com o Google.',
      unauthorizedTitle: 'Conta sem permissão',
      unauthorizedPrefix: 'A sessão atual',
      unauthorizedMiddle: 'não possui acesso. Entre com',
      tabs: {
        all: (count) => `Todas (${count})`,
        pendiente: 'Pendentes',
        en_revision: 'Em revisão',
        contactado: 'Contatados',
        cerrado: 'Encerrados',
      },
      statusLabels: {
        pendiente: 'Pendente',
        en_revision: 'Em revisão',
        contactado: 'Contatado',
        cerrado: 'Encerrado',
      },
      loadingDocs: 'Carregando solicitações...',
      emptyDocs: 'Nenhuma solicitação registrada ainda.',
      recentFallback: 'Recente',
      confirmDelete: 'Confirmar exclusão',
      cancelDelete: 'Cancelar',
      deleteAria: 'Excluir solicitação',
      modeAndTier: 'Modalidade e Nível',
      soloShort: 'Solo',
      teamShort: 'Equipe',
      refLink: 'Referência',
      reportedConcern: 'Preocupação ou incidente',
      noComments: 'Sem observações adicionais.',
      dossierStatus: 'Status',
      closedLockedMsg: 'Expediente encerrado.',
      reopenBtn: 'Reabrir',
      internalNotesLabel: 'Notas internas',
      internalNotesPlaceholder: 'Observações de acompanhamento...',
      savingBtn: 'Salvando...',
      saveNotesBtn: 'Salvar notas',
      feedbackSyncError: 'Não foi possível sincronizar as solicitações.',
      feedbackStatusUpdated: (label) => `Status atualizado para ${label}.`,
      feedbackStatusError: 'Erro ao atualizar o status.',
      feedbackNotesSaved: 'Notas salvas.',
      feedbackNotesError: 'Não foi possível salvar as notas.',
      feedbackDeleteError: 'Não foi possível excluir o registro.',
    },
  },
};

const LANG_STORAGE_KEY = 'coto_privado_lang';

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationDictionary;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    try {
      const stored = localStorage.getItem(LANG_STORAGE_KEY);
      if (stored === 'es' || stored === 'en' || stored === 'pt') {
        return stored;
      }
    } catch {
      // Ignore storage access errors
    }
    return 'es';
  });

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // Ignore
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
    document.title = DICTIONARIES[lang].metaTitle;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: DICTIONARIES[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used inside I18nProvider');
  }
  return ctx;
}
