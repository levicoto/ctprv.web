import { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type Language = 'es' | 'en' | 'pt';

export interface PartnerTranslation {
  id: string;
  name: string;
  role: string;
  desc: string;
}

export interface RaptorCapabilityItem {
  num: string;
  title: string;
  desc: string;
}

export interface CrisisResourceLink {
  name: string;
  desc: string;
  url: string;
}

export interface CrisisScenarioItem {
  id: 'hack' | 'extortion' | 'reputation';
  label: string;
  steps: RaptorCapabilityItem[];
  avoidLabel: string;
  avoidAction: string;
  resources: CrisisResourceLink[];
}

export type MetricsScopeId = 'consolidated' | 'pep' | 'atlas';

export interface MetricsPointItem {
  day: number;
  label: string;
  exposure: number;
}

export interface MetricsBarItem {
  label: string;
  before: number;
  after: number;
}

export interface MetricsScopeTranslation {
  id: MetricsScopeId;
  tabLabel: string;
  headlineStat: string;
  headlineLabel: string;
  points: [MetricsPointItem, MetricsPointItem, MetricsPointItem];
  bars: [MetricsBarItem, MetricsBarItem, MetricsBarItem, MetricsBarItem];
  summaryNote: string;
}

export interface BoutiquePillarItem {
  num: string;
  title: string;
  desc: string;
}

export interface BoutiqueAudienceItem {
  id: 'pep' | 'creators' | 'private';
  num: string;
  title: string;
  desc: string;
  cta: string;
}

export interface TranslationDictionary {
  metaTitle: string;
  raptorMetaTitle: string;
  crisisMetaTitle: string;
  nav: {
    overview: string;
    profiles: string;
    services: string;
    units: string;
    pep: string;
    metrics: string;
    backing: string;
    raptor: string;
    crisis: string;
    evaluation: string;
    cta: string;
    mobileCta: string;
    menuOpen: string;
    menuClose: string;
    menuOpenAria: string;
    menuCloseAria: string;
    mobileUnitsLabel: string;
    mobileLangLabel: string;
    ariaMain: string;
    langSelectorAria: string;
  };
  hero: {
    headline: string;
    body: string;
    primaryCta: string;
    emergencyTrigger: string;
    padlockAria: string;
  };
  profiles: {
    pitchLead: string;
    pitchAnchor: string;
    pillarsLabel: string;
    pillars: [BoutiquePillarItem, BoutiquePillarItem, BoutiquePillarItem];
    audiencesLabel: string;
    audiences: [BoutiqueAudienceItem, BoutiqueAudienceItem, BoutiqueAudienceItem];
  };
  services: {
    headline: string;
    subtitle: string;
    shieldAria: string;
    argos: {
      tierTag: string;
      scopeTag: string;
      name: string;
      scopeSummary: string;
      bullets: [string, string, string, string];
      cta: string;
    };
    atlas: {
      tierTag: string;
      scopeTag: string;
      name: string;
      scopeSummary: string;
      bullets: [string, string, string, string];
      cta: string;
    };
  };
  units: {
    headline: string;
    subtitle: string;
    palantirr: {
      num: string;
      tag: string;
      name: string;
      summary: string;
      bullets: [string, string, string];
      cta: string;
    };
    incidentProtocol: {
      num: string;
      tag: string;
      name: string;
      summary: string;
      bullets: [string, string, string];
      cta: string;
      emergencyLink: string;
    };
  };
  pep: {
    kicker: string;
    headline: string;
    body: string;
    cta: string;
    pillars: RaptorCapabilityItem[];
    footnote: string;
    raptorCta: string;
  };
  metrics: {
    headline: string;
    scopeSelectorAria: string;
    chartAria: string;
    barsHeaderLeft: string;
    barsHeaderRight: string;
    cta: string;
    scopes: [MetricsScopeTranslation, MetricsScopeTranslation, MetricsScopeTranslation];
  };
  raptor: {
    nav: {
      backToMain: string;
      overview: string;
      capabilities: string;
      dossier: string;
      evaluation: string;
      cta: string;
    };
    hero: {
      kicker: string;
      name: string;
      subtitle: string;
      body: string;
      primaryCta: string;
      eyeAria: string;
    };
    capabilities: {
      headline: string;
      subtitle: string;
      items: RaptorCapabilityItem[];
    };
    dossier: {
      kicker: string;
      title: string;
      body: string;
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
    raptorHeadline: string;
    raptorBody: string;
    crisisHeadline: string;
    crisisBody: string;
    pepHeadline: string;
    pepBody: string;
    pepSwitchToGeneral: string;
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
      raptorSubmitIdle: string;
      crisisSubmitIdle: string;
      pepSubmitIdle: string;
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
      gmailBtn: string;
      resetBtn: string;
      tierDisplayArgos: string;
      tierDisplayAtlas: string;
      tierDisplayRaptor: string;
      tierDisplayPep: string;
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
      openSignalBtn: string;
    };
    signalCard: {
      emergencyToggle: string;
      emergencyNotice: string;
      emergencySignalLabel: string;
      emergencySignalSubtitle: string;
      unlockedKicker: (folio: string) => [string, string];
      unlockedTitle: string;
      unlockedBody: (folio: string) => string;
      userLabel: string;
      signalSubtitle: string;
      openSignalBtn: string;
      emailLabel: string;
      openMailAppBtn: string;
      openGmailBtn: string;
      openOutlookBtn: string;
      copyEmailBtn: string;
      copiedEmailBtn: string;
      privacyTrigger: string;
    };
  };
  footer: {
    raptorLink: string;
    crisisLink: string;
    contactTrigger: string;
    privacyLink: string;
    privateAccess: string;
  };
  privacy: {
    dialogAria: string;
    kicker: string;
    title: string;
    intro: string;
    clauses: {
      num: string;
      title: string;
      desc: string;
    }[];
    directLabel: string;
    openSignalBtn: string;
    closeBtn: string;
    closeAria: string;
  };
  emergencyModal: {
    dialogAria: string;
    kicker: string;
    title: string;
    body: string;
    signalLabel: string;
    signalSubtitle: string;
    openSignalBtn: string;
    crisisGuideCta: string;
    preventivePrompt: string;
    preventiveCta: string;
    privacyLink: string;
    closeAria: string;
  };
  crisisPage: {
    nav: {
      backToMain: string;
      overview: string;
      protocol: string;
      hygiene: string;
      evaluation: string;
      cta: string;
    };
    hero: {
      kicker: string;
      headline: string;
      body: string;
      primaryCta: string;
      signalCta: string;
      chamberAria: string;
    };
    protocol: {
      kicker: string;
      title: string;
      subtitle: string;
      tabAria: string;
      resourcesTitle: string;
      resourcesNote: string;
      helpPrompt: string;
      helpCta: string;
      scenarios: CrisisScenarioItem[];
    };
    hygiene: {
      headline: string;
      subtitle: string;
      items: RaptorCapabilityItem[];
      auditCta: string;
    };
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
    switchAccountBtn: string;
    tabs: {
      all: (count: number) => string;
      pendiente: (count: number) => string;
      en_revision: (count: number) => string;
      contactado: (count: number) => string;
      cerrado: (count: number) => string;
    };
    statusLabels: {
      pendiente: string;
      en_revision: string;
      contactado: string;
      cerrado: string;
    };
    searchPlaceholder: string;
    clearSearchAria: string;
    serviceFilterAria: string;
    serviceAll: string;
    sortNewest: string;
    sortOldest: string;
    queueCount: (shown: number, total: number) => string;
    selectPrompt: string;
    openDossier: string;
    backToList: (count: number) => string;
    dossierPosition: (index: number, total: number) => string;
    prevRequest: string;
    nextRequest: string;
    emptyFiltered: string;
    clearFiltersBtn: string;
    serviceLabel: string;
    modeLabel: string;
    dateLabel: string;
    copyBtn: string;
    copiedBtn: string;
    openLinkBtn: string;
    deleteBtn: string;
    unsavedNotes: string;
    hasNotesTag: string;
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
    metaTitle: 'Privado',
    raptorMetaTitle: 'Privado',
    crisisMetaTitle: 'Privado',
    nav: {
      overview: 'Inicio',
      profiles: 'Perfiles',
      services: 'Niveles',
      units: 'Inteligencia',
      pep: 'PEP',
      metrics: 'Métricas',
      backing: 'Infraestructura',
      raptor: 'Palantirr',
      crisis: 'Protocolo de Incidentes',
      evaluation: 'Evaluación',
      cta: 'Solicitar Evaluación',
      mobileCta: 'Solicitar Evaluación',
      menuOpen: 'Menú',
      menuClose: 'Cerrar',
      menuOpenAria: 'Abrir menú de navegación',
      menuCloseAria: 'Cerrar menú de navegación',
      mobileUnitsLabel: 'Unidades bajo demanda',
      mobileLangLabel: 'Idioma',
      ariaMain: 'Navegación principal',
      langSelectorAria: 'Seleccionar idioma',
    },
    hero: {
      headline: 'Su identidad, blindada. Su reputación, intacta.',
      body: 'Ciberseguridad e inteligencia OSINT de grado corporativo, dedicadas exclusivamente a proteger su patrimonio digital y su círculo cero.',
      primaryCta: 'Solicitar Evaluación',
      emergencyTrigger: 'Atención ante incidentes',
      padlockAria: 'Escultura óptica de bóveda personal',
    },
    profiles: {
      pitchLead:
        'Un escolta élite para su seguridad física. Un banquero suizo para su privacidad financiera.',
      pitchAnchor: 'Coto Privado para su identidad digital.',
      pillarsLabel: 'Principios operativos',
      pillars: [
        {
          num: '01',
          title: 'Soberanía Digital',
          desc: 'Recupere el control total sobre lo que internet sabe de usted y su familia.',
        },
        {
          num: '02',
          title: 'Ejecución en Segundo Plano',
          desc: 'Neutralizamos riesgos antes del impacto para que usted lidere sin interrupciones.',
        },
        {
          num: '03',
          title: 'Asimetría a su Favor',
          desc: 'Dedicamos infraestructura de defensa bancaria a proteger su patrimonio personal.',
        },
      ],
      audiencesLabel: 'Para quién actuamos',
      audiences: [
        {
          id: 'pep',
          num: '01',
          title: 'Figuras Públicas y PEPs',
          desc: 'Neutralizamos fugas de datos y riesgos reputacionales bajo escrutinio público.',
          cta: 'Ver Protocolo PEP',
        },
        {
          id: 'creators',
          num: '02',
          title: 'Creadores y Visionarios',
          desc: 'Impedimos el secuestro de cuentas, el doxxing y los ataques a sus ingresos.',
          cta: 'Proteger cuentas',
        },
        {
          id: 'private',
          num: '03',
          title: 'Intereses Privados',
          desc: 'Retiramos registros expuestos y aislamos su patrimonio digital de terceros.',
          cta: 'Evaluar alcance',
        },
      ],
    },
    services: {
      headline: 'Niveles de Servicio',
      subtitle: 'Dos alcances definidos según administre sus cuentas personalmente o delegue accesos.',
      shieldAria: 'Escultura óptica de blindaje de activos',
      argos: {
        tierTag: 'Nivel I',
        scopeTag: 'Gestión Personal',
        name: 'Argos',
        scopeSummary: 'Cobertura directa sobre sus cuentas, dispositivos y registros personales.',
        bullets: [
          'Aislamos sus cuentas bancarias y personales mediante identidades separadas.',
          'Retiramos domicilios, teléfonos y filtraciones históricas expuestas en la red.',
          'Protegemos sus teléfonos y portátiles frente a intrusiones y robo de sesión.',
          'Bloqueamos el secuestro de líneas móviles y accesos no autorizados.',
        ],
        cta: 'Solicitar Nivel Argos',
      },
      atlas: {
        tierTag: 'Nivel II',
        scopeTag: 'Delegación de Accesos',
        name: 'Atlas',
        scopeSummary: 'Cobertura extendida a su familia, asistentes y equipos de comunicación.',
        bullets: [
          'Incluye todo el alcance de Gestión Personal (Argos).',
          'Delegamos redes y canales a su equipo sin revelar contraseñas maestras.',
          'Protegemos los dispositivos y cuentas de su cónyuge, hijos y círculo cero.',
          'Aislamos incidentes y restituimos activos comprometidos en menos de 30 minutos.',
        ],
        cta: 'Solicitar Nivel Atlas',
      },
    },
    units: {
      headline: 'Inteligencia bajo demanda y respuesta crítica.',
      subtitle: 'Unidades de activación directa para decisiones estratégicas o contención de incidentes.',
      palantirr: {
        num: '01',
        tag: 'OSINT Pasivo',
        name: 'Palantirr',
        summary:
          'Identificamos con exactitud qué expone hoy internet sobre usted, su familia o una contraparte.',
        bullets: [
          'Auditamos filtraciones, registros públicos y vínculos patrimoniales sin dejar rastro.',
          'Verificamos riesgos reputacionales antes de cerrar alianzas, inversiones o acuerdos.',
          'Entregamos un informe ejecutivo con hallazgos verificados y ruta de retiro.',
        ],
        cta: 'Explorar Palantirr',
      },
      incidentProtocol: {
        num: '02',
        tag: 'Respuesta Crítica',
        name: 'Protocolo de Incidentes',
        summary:
          'Frene secuestros de cuentas, extorsiones o filtraciones durante los primeros 30 minutos.',
        bullets: [
          'Aislamos dispositivos afectados y cerramos sesiones intrusas de inmediato.',
          'Preservamos pruebas íntegras y cortamos accesos abiertos en su nube personal.',
          'Restituimos el control de perfiles oficiales, dominios y líneas telefónicas.',
        ],
        cta: 'Abrir Protocolo de Incidentes',
        emergencyLink: 'Línea directa en Signal',
      },
    },
    pep: {
      kicker: 'Protocolo PEP',
      headline: 'Proteja a su familia antes de entrar al escrutinio público.',
      body: 'Retiramos datos vulnerables y blindamos su círculo cero antes de una candidatura, designación pública o declaración patrimonial.',
      cta: 'Solicitar Protocolo PEP',
      pillars: [
        {
          num: '01',
          title: 'Retiro Preventivo de Datos',
          desc: 'Eliminamos domicilios, teléfonos privados y registros expuestos antes del anuncio oficial.',
        },
        {
          num: '02',
          title: 'Frontera entre Ley y Vida Privada',
          desc: 'Separamos la transparencia exigida por ley del patrimonio privado de su familia.',
        },
        {
          num: '03',
          title: 'Protección del Círculo Cero',
          desc: 'Aseguramos los teléfonos y líneas móviles de cónyuge, hijos y asesores cercanos.',
        },
        {
          num: '04',
          title: 'Delegación de Prensa sin Claves',
          desc: 'Habilitamos a su equipo de campaña para publicar sin poseer sus llaves maestras.',
        },
      ],
      footnote: 'Actuación apartidista bajo acuerdo NDA · Cobertura internacional',
      raptorCta: 'Analizar exposición con Palantirr',
    },
    metrics: {
      headline: 'Reducción real en 90 días.',
      scopeSelectorAria: 'Seleccionar perfil',
      chartAria: 'Curva de reducción de exposición pública entre hoy y el día 90',
      barsHeaderLeft: 'Frentes protegidos',
      barsHeaderRight: 'Hoy → Día 90',
      cta: 'Evaluar mi exposición',
      scopes: [
        {
          id: 'consolidated',
          tabLabel: 'Consolidado',
          headlineStat: '-92%',
          headlineLabel: 'de huella pública expuesta',
          points: [
            { day: 0, label: 'Hoy', exposure: 100 },
            { day: 30, label: 'Día 30', exposure: 26 },
            { day: 90, label: 'Día 90', exposure: 8 },
          ],
          bars: [
            { label: 'Domicilios y teléfonos públicos', before: 94, after: 8 },
            { label: 'Contraseñas y cuentas filtradas', before: 88, after: 4 },
            { label: 'Accesos de familia y equipo', before: 91, after: 5 },
            { label: 'Riesgo en móviles y líneas', before: 84, after: 6 },
          ],
          summaryNote:
            'Casos reales bajo acuerdo NDA · Contención en < 24 min · 0 claves compartidas',
        },
        {
          id: 'pep',
          tabLabel: 'Figuras Públicas',
          headlineStat: '-94%',
          headlineLabel: 'de rastro privado localizable',
          points: [
            { day: 0, label: 'Hoy', exposure: 100 },
            { day: 30, label: 'Día 30', exposure: 19 },
            { day: 90, label: 'Día 90', exposure: 6 },
          ],
          bars: [
            { label: 'Domicilios y registros familiares', before: 98, after: 6 },
            { label: 'Correos y archivos históricos', before: 86, after: 3 },
            { label: 'Prensa y asesores con acceso', before: 95, after: 4 },
            { label: 'Líneas móviles del círculo cero', before: 90, after: 5 },
          ],
          summaryNote:
            'Actuación apartidista bajo NDA · Respuesta en < 18 min · 0 claves expuestas',
        },
        {
          id: 'atlas',
          tabLabel: 'Creadores y Patrimonio',
          headlineStat: '-89%',
          headlineLabel: 'de superficie vulnerable',
          points: [
            { day: 0, label: 'Hoy', exposure: 100 },
            { day: 30, label: 'Día 30', exposure: 29 },
            { day: 90, label: 'Día 90', exposure: 11 },
          ],
          bars: [
            { label: 'Canales de ingresos y bancos', before: 94, after: 3 },
            { label: 'Editores, agencias y asistentes', before: 96, after: 4 },
            { label: 'Dominios y correo principal', before: 90, after: 8 },
            { label: 'Vida privada y patrimonio', before: 85, after: 11 },
          ],
          summaryNote:
            'Custodia sin fricción diaria · Contención en < 30 min · 0 claves filtradas',
        },
      ],
    },
    raptor: {
      nav: {
        backToMain: 'Inicio',
        overview: 'Resumen',
        capabilities: 'Alcance',
        dossier: 'Informe',
        evaluation: 'Admisión',
        cta: 'Solicitar Informe',
      },
      hero: {
        kicker: 'OSINT Pasivo',
        name: 'Palantirr',
        subtitle: 'Radiografía exacta de su exposición en internet.',
        body: 'Identificamos qué datos suyos, de su familia o de una contraparte están hoy al alcance de terceros, sin alertar al objetivo.',
        primaryCta: 'Solicitar Informe Palantirr',
        eyeAria: 'Faro óptico de análisis pasivo',
      },
      capabilities: {
        headline: 'Qué revelamos',
        subtitle: 'Correlación directa sobre fuentes abiertas, filtraciones históricas y registros públicos.',
        items: [
          {
            num: '01',
            title: 'Verificación de Contrapartes',
            desc: 'Evaluamos antecedentes, litigios y vínculos reputacionales antes de firmar acuerdos.',
          },
          {
            num: '02',
            title: 'Exposición del Círculo Cero',
            desc: 'Localizamos domicilios, teléfonos y rutinas expuestas de usted y su familia.',
          },
          {
            num: '03',
            title: 'Credenciales y Archivos Filtrados',
            desc: 'Detectamos contraseñas comprometidas, documentos indexados y metadatos sensibles.',
          },
          {
            num: '04',
            title: 'Suplantación y Dominios Espejo',
            desc: 'Identificamos cuentas apócrifas y dominios creados para usurpar su identidad.',
          },
        ],
      },
      dossier: {
        kicker: 'Entregable Ejecutivo',
        title: 'Informe de Exposición y Ruta de Cierre',
        body: 'Reciba cada hallazgo verificado por severidad junto con las acciones exactas para retirar su información.',
        cta: 'Solicitar Informe Palantirr',
      },
    },
    tech: {
      headline: 'Infraestructura de Inteligencia a su Medida',
      body: 'Integramos estándares de defensa bancaria en sus dispositivos y cuentas personales sin fricción diaria.',
      partners: [
        {
          id: 'keeper',
          name: 'Keeper',
          role: 'Custodia y delegación',
          desc: 'Protegemos sus claves maestras y delegamos accesos sin mostrarlas.',
        },
        {
          id: 'cloudflare',
          name: 'Cloudflare',
          role: 'Blindaje de red y dominios',
          desc: 'Bloqueamos enlaces fraudulentos, rastreadores y ataques a sus dominios.',
        },
        {
          id: 'eset',
          name: 'ESET',
          role: 'Defensa de ordenadores',
          desc: 'Frenamos el robo de sesiones y el software espía en Mac y Windows.',
        },
        {
          id: 'action1',
          name: 'Action1',
          role: 'Cierre de vulnerabilidades',
          desc: 'Sellamos brechas críticas en sus aplicaciones de forma automática.',
        },
        {
          id: 'iverify',
          name: 'iVerify',
          role: 'Integridad móvil',
          desc: 'Detectamos intrusiones avanzadas en iPhone y Android.',
        },
      ],
    },
    form: {
      headline: 'Solicitar Evaluación',
      body: 'Indique su nombre, un alias o un representante para estructurar su protección. Jamás solicitamos contraseñas.',
      raptorHeadline: 'Admisión: Palantirr',
      raptorBody:
        'Indique un nombre, alias o representante para definir el alcance de su informe OSINT bajo acuerdo NDA.',
      crisisHeadline: 'Atención de Incidentes',
      crisisBody:
        'Registre su situación para activar contención técnica inmediata y restitución de cuentas.',
      pepHeadline: 'Admisión: Protocolo PEP',
      pepBody:
        'Coordine la protección suya y de su familia antes de una candidatura, cargo público o declaración patrimonial.',
      pepSwitchToGeneral: 'Cambiar a evaluación general (Argos / Atlas)',
      fields: {
        nameLabel: 'Nombre, alias o representante',
        namePlaceholder: 'Ej. M. Valdés',
        roleLabel: 'Actividad o perfil',
        rolePlaceholder: 'Figura pública, Creador, Empresario, Candidatura...',
        refLabel: 'Perfil o dominio de referencia',
        refPlaceholder: '@usuario o https://sudominio.com',
        modeLabel: 'Alcance',
        modeAria: 'Alcance de servicio',
        soloOption: 'Gestión personal',
        teamOption: 'Con delegación',
        concernLabel: 'Prioridad o fecha clave',
        optionalTag: 'Opcional',
        concernPlaceholder: 'Objetivo principal o próximo anuncio público...',
        submitIdle: 'Solicitar Evaluación',
        raptorSubmitIdle: 'Solicitar Informe Palantirr',
        crisisSubmitIdle: 'Activar Contención',
        pepSubmitIdle: 'Solicitar Protocolo PEP',
        submitLoading: 'Registrando solicitud...',
      },
      validation: {
        errorPrefix: 'Verificación',
        nameLength: (min, max) =>
          `Indique un nombre, alias o representante (${min} a ${max} caracteres).`,
        roleLength: (min, max) => `Indique su perfil (${min} a ${max} caracteres).`,
        refEmpty: 'Indique un perfil (@usuario) o dominio.',
        refInvalid: 'Ingrese un dominio válido (ej. sudominio.com) o perfil (@usuario).',
        concernMax: (max) => `Máximo ${max} caracteres.`,
        idGenFailed: 'No fue posible generar el código de expediente. Intente de nuevo.',
        quotaExceeded: 'Recepción diaria completa. Escríbanos directamente por Signal o correo.',
        genericSubmitError: 'No fue posible enviar la solicitud. Verifique su conexión.',
      },
      confirmation: {
        title: 'Solicitud Registrada',
        folioLabel: 'Expediente',
        tierLabel: 'Alcance asignado',
        nameLabel: 'Titular / Alias',
        roleLabel: 'Perfil',
        refLabel: 'Referencia',
        modeLabel: 'Modalidad',
        modeSoloDesc: 'Gestión personal',
        modeTeamDesc: 'Delegación de accesos',
        downloadBtn: 'Descargar constancia',
        emailBtn: 'App de correo',
        gmailBtn: 'Gmail Web',
        resetBtn: 'Nueva solicitud',
        tierDisplayArgos: 'Nivel I · Argos',
        tierDisplayAtlas: 'Nivel II · Atlas',
        tierDisplayRaptor: 'Palantirr',
        tierDisplayPep: 'Protocolo PEP',
        receiptHeader: 'COTO PRIVADO · CONSTANCIA DE EXPEDIENTE',
        receiptFolio: 'Expediente',
        receiptDate: 'Fecha',
        receiptName: 'Titular / Alias',
        receiptRole: 'Perfil',
        receiptRef: 'Referencia',
        receiptMode: 'Modalidad',
        receiptModeSolo: 'Gestión personal',
        receiptModeTeam: 'Delegación de accesos',
        receiptTier: 'Servicio',
        receiptNotes: 'Notas',
        receiptNoNotes: 'Sin notas adicionales',
        mailSubjectPrefix: 'Expediente Coto Privado',
        openSignalBtn: 'Abrir Signal',
      },
      signalCard: {
        emergencyToggle: '¿Enfrenta un incidente activo ahora mismo?',
        emergencyNotice:
          'Canal directo para secuestro de cuentas en curso, extorsión activa o filtración inminente.',
        emergencySignalLabel: 'Respuesta inmediata',
        emergencySignalSubtitle: 'Canal directo en Signal',
        unlockedKicker: (folio) => ['Canal directo habilitado', `Expediente ${folio}`],
        unlockedTitle: 'Contacto directo disponible',
        unlockedBody: (folio) =>
          `Escríbanos por Signal o correo indicando su expediente ${folio} para agilizar la atención.`,
        userLabel: 'Signal directo',
        signalSubtitle: 'Cifrado de extremo a extremo',
        openSignalBtn: 'Abrir Signal',
        emailLabel: 'Correo directo',
        openMailAppBtn: 'App de correo',
        openGmailBtn: 'Gmail Web',
        openOutlookBtn: 'Outlook Web',
        copyEmailBtn: 'Copiar correo',
        copiedEmailBtn: 'Copiado',
        privacyTrigger: 'Acuerdo NDA y tratamiento de datos',
      },
    },
    footer: {
      raptorLink: 'Palantirr',
      crisisLink: 'Protocolo de Incidentes',
      contactTrigger: 'Línea Directa',
      privacyLink: 'Acuerdo NDA',
      privateAccess: 'Acceso',
    },
    privacy: {
      dialogAria: 'Acuerdo NDA y soberanía de datos de Coto Privado',
      kicker: 'Coto Privado',
      title: 'Acuerdo NDA y Soberanía de Datos',
      intro: 'Recolectamos únicamente los datos mínimos necesarios para evaluar su caso.',
      clauses: [
        {
          num: '01',
          title: 'Acuerdo legal de no divulgación (NDA)',
          desc: 'Protegemos su identidad y la de su familia desde el primer contacto mediante contrato legal.',
        },
        {
          num: '02',
          title: 'Admisión mediante alias o representante',
          desc: 'Aceptamos alias operativos y jamás compartimos ni comercializamos su información.',
        },
        {
          num: '03',
          title: 'Cero solicitud de claves en esta web',
          desc: 'Nunca pedimos contraseñas ni códigos SMS aquí; toda coordinación técnica ocurre vía Signal.',
        },
        {
          num: '04',
          title: 'Eliminación inmediata a petición suya',
          desc: 'Usted puede ordenar el borrado definitivo de su expediente en cualquier momento.',
        },
      ],
      directLabel: 'Canal directo',
      openSignalBtn: 'Escribir por Signal',
      closeBtn: 'Cerrar',
      closeAria: 'Cerrar ventana',
    },
    emergencyModal: {
      dialogAria: 'Atención inmediata ante incidentes activos',
      kicker: 'Respuesta Crítica',
      title: 'Atención inmediata ante incidentes',
      body: 'Si sufre robo de cuentas, extorsión o filtración de datos en curso, contacte directamente a un especialista.',
      signalLabel: 'Especialista en línea',
      signalSubtitle: 'Comunicación directa vía Signal',
      openSignalBtn: 'Conectar por Signal',
      crisisGuideCta: 'Ver pasos para los primeros 30 minutos',
      preventivePrompt: '¿Busca protección preventiva?',
      preventiveCta: 'Ir a Solicitar Evaluación',
      privacyLink: 'Acuerdo NDA',
      closeAria: 'Cerrar ventana',
    },
    crisisPage: {
      nav: {
        backToMain: 'Inicio',
        overview: 'Resumen',
        protocol: 'Pasos',
        hygiene: 'Reglas',
        evaluation: 'Asistencia',
        cta: 'Solicitar Contención',
      },
      hero: {
        kicker: 'Primeros 30 Minutos',
        headline: 'Contenga un ataque a sus cuentas antes de que escale.',
        body: 'Siga este orden exacto y utilice únicamente los enlaces oficiales para frenar el daño y conservar pruebas.',
        primaryCta: 'Ver pasos de acción',
        signalCta: 'Línea directa en Signal',
        chamberAria: 'Escultura óptica de cámara de contención',
      },
      protocol: {
        kicker: 'Actuación Inmediata',
        title: 'Seleccione el incidente en curso',
        subtitle: 'Ejecute cada paso en orden y acceda sin intermediarios a los portales oficiales.',
        tabAria: 'Tipos de incidente',
        resourcesTitle: 'Portales oficiales de recuperación',
        resourcesNote: 'Acceso directo verificado',
        helpPrompt: '¿Requiere que asumamos el control técnico?',
        helpCta: 'Solicitar intervención',
        scenarios: [
          {
            id: 'hack',
            label: 'Secuestro de cuentas',
            steps: [
              {
                num: '01',
                title: 'Corte internet del equipo afectado sin formatearlo',
                desc: 'Apague Wi-Fi y datos de inmediato; cambiar claves desde un equipo infectado las entrega al atacante.',
              },
              {
                num: '02',
                title: 'Asegure su correo raíz desde un dispositivo limpio',
                desc: 'Cambie la contraseña desde otro equipo, cierre sesiones activas y elimine reenvíos ocultos.',
              },
              {
                num: '03',
                title: 'Revocar sesiones y migrar de SMS a llave o app 2FA',
                desc: 'Desvincule equipos extraños en WhatsApp, Google, Apple o Meta y active verificación por aplicación.',
              },
              {
                num: '04',
                title: 'Bloquee su línea móvil y alerte a su banco',
                desc: 'Si perdió señal celular, exija a su operadora bloquear duplicados de SIM y frene transferencias.',
              },
            ],
            avoidLabel: 'Qué evitar',
            avoidAction:
              'Nunca pague a supuestos recuperadores en redes sociales; ningún tercero externo tiene acceso legítimo.',
            resources: [
              {
                name: 'Google Security Checkup',
                desc: 'Cierre de sesiones, filtros y permisos activos',
                url: 'https://myaccount.google.com/security-checkup',
              },
              {
                name: 'Apple Account Recovery',
                desc: 'Restitución de Apple ID y dispositivos autorizados',
                url: 'https://iforgot.apple.com/',
              },
              {
                name: 'Microsoft Security',
                desc: 'Historial de accesos y cierre global de sesiones',
                url: 'https://account.microsoft.com/security',
              },
              {
                name: 'Meta Account Recovery',
                desc: 'Recuperación oficial para Instagram y Facebook',
                url: 'https://www.instagram.com/hacked/',
              },
            ],
          },
          {
            id: 'extortion',
            label: 'Doxxing o extorsión',
            steps: [
              {
                num: '01',
                title: 'Compruebe si es una filtración real o un correo falso',
                desc: 'La mayoría de extorsiones citan contraseñas antiguas para simular control actual sobre su equipo.',
              },
              {
                num: '02',
                title: 'Conserve los mensajes originales sin editarlos',
                desc: 'Descargue los correos en formato .eml y guarde capturas con fecha, hora y enlaces completos.',
              },
              {
                num: '03',
                title: 'Cierre carpetas y enlaces públicos en su nube',
                desc: 'Desde un equipo limpio, revoque enlaces activos en Google Drive, iCloud, Dropbox o Notion.',
              },
              {
                num: '04',
                title: 'No transfiera dinero sin haber cerrado la brecha',
                desc: 'Pagar con la intrusión abierta nunca detiene la difusión y multiplica las exigencias.',
              },
            ],
            avoidLabel: 'Qué evitar',
            avoidAction:
              'No responda ni negocie con el extorsionador mientras persistan sesiones ajenas en su correo o nube.',
            resources: [
              {
                name: 'Have I Been Pwned',
                desc: 'Verificación de filtraciones históricas de su correo',
                url: 'https://haveibeenpwned.com/',
              },
              {
                name: 'Google Security Checkup',
                desc: 'Auditoría de aplicaciones con acceso a sus archivos',
                url: 'https://myaccount.google.com/security-checkup',
              },
              {
                name: 'Google Content Removal',
                desc: 'Baja de datos personales expuestos en el buscador',
                url: 'https://reportcontent.google.com/',
              },
              {
                name: 'StopNCII.org',
                desc: 'Bloqueo preventivo de difusión íntima no consentida',
                url: 'https://stopncii.org/',
              },
            ],
          },
          {
            id: 'reputation',
            label: 'Suplantación de identidad',
            steps: [
              {
                num: '01',
                title: 'Respalde las URLs falsas antes de reportarlas',
                desc: 'Archive el enlace exacto con sello de tiempo antes de solicitar el derribo de la página o perfil.',
              },
              {
                num: '02',
                title: 'Identifique el proveedor del dominio apócrifo',
                desc: 'Consulte ICANN para exigir la baja por abuso al registrador y bloquéelo en navegadores.',
              },
              {
                num: '03',
                title: 'Avise por voz a su familia y colaboradores',
                desc: 'Los suplantadores contactan en paralelo a su entorno pidiendo transferencias o códigos urgentes.',
              },
              {
                num: '04',
                title: 'Desmienta desde su cuenta real sin enlazar el fraude',
                desc: 'Publique una aclaración breve en su canal verificado sin dar tráfico al sitio falso.',
              },
            ],
            avoidLabel: 'Qué evitar',
            avoidAction:
              'No abra enlaces sospechosos desde su red doméstica o móvil; suelen capturar su ubicación IP real.',
            resources: [
              {
                name: 'ICANN Registration Lookup',
                desc: 'Consulta del proveedor que aloja un dominio falso',
                url: 'https://lookup.icann.org/',
              },
              {
                name: 'Google Safe Browsing',
                desc: 'Bloqueo de sitios fraudulentos en navegadores',
                url: 'https://safebrowsing.google.com/safebrowsing/report_phish/',
              },
              {
                name: 'Wayback Machine Save',
                desc: 'Captura verificable previa al retiro de una página',
                url: 'https://web.archive.org/save',
              },
              {
                name: 'Google Legal Removal',
                desc: 'Baja legal por suplantación o difamación',
                url: 'https://reportcontent.google.com/',
              },
            ],
          },
        ],
      },
      hygiene: {
        headline: 'Cuatro reglas permanentes de control',
        subtitle: 'Medidas directas que neutralizan la mayoría de ataques dirigidos.',
        items: [
          {
            num: '01',
            title: 'Aísle un correo exclusivo para bancos y patrimonio',
            desc: 'Nunca utilice su dirección pública para banca, inversiones o dominios principales.',
          },
          {
            num: '02',
            title: 'Elimine el SMS como factor de seguridad',
            desc: 'Proteja sus cuentas críticas con llaves físicas o aplicaciones autenticadoras.',
          },
          {
            num: '03',
            title: 'Delegue accesos sin compartir contraseñas',
            desc: 'Otorgue permisos revocables a su equipo mediante bóvedas de custodia.',
          },
          {
            num: '04',
            title: 'Valide por llamada cualquier urgencia financiera',
            desc: 'Confirme siempre por voz directa toda solicitud inusual de fondos o documentos.',
          },
        ],
        auditCta: 'Proteger mi entorno personal',
      },
    },
    admin: {
      dialogAria: 'Panel de expedientes Coto Privado',
      headerTitle: 'Expedientes · Coto Privado',
      exportCsv: 'Exportar CSV',
      signOut: 'Salir',
      closeAria: 'Cerrar panel',
      verifying: 'Verificando credenciales...',
      signInTitle: 'Acceso Autorizado',
      signInDesc: 'Ingrese con su cuenta @coto.lat para gestionar los expedientes.',
      signInBtn: 'Acceder con Google',
      signInFailed: 'No fue posible completar la autenticación.',
      unauthorizedTitle: 'Cuenta no autorizada',
      unauthorizedPrefix: 'La sesión',
      unauthorizedMiddle: 'no tiene permisos. Ingrese con una cuenta',
      switchAccountBtn: 'Cambiar cuenta',
      tabs: {
        all: (count) => `Todos (${count})`,
        pendiente: (count) => `Pendientes (${count})`,
        en_revision: (count) => `En revisión (${count})`,
        contactado: (count) => `Contactados (${count})`,
        cerrado: (count) => `Cerrados (${count})`,
      },
      statusLabels: {
        pendiente: 'Pendiente',
        en_revision: 'En revisión',
        contactado: 'Contactado',
        cerrado: 'Cerrado',
      },
      searchPlaceholder: 'Filtrar por expediente, titular, perfil o notas...',
      clearSearchAria: 'Limpiar búsqueda',
      serviceFilterAria: 'Filtrar por servicio',
      serviceAll: 'Todos los servicios',
      sortNewest: 'Más recientes',
      sortOldest: 'Más antiguos',
      queueCount: (shown, total) =>
        shown === total
          ? `${total} ${total === 1 ? 'expediente' : 'expedientes'}`
          : `${shown} de ${total} expedientes`,
      selectPrompt: 'Seleccione un expediente',
      openDossier: 'Abrir',
      backToList: (count) => `Volver (${count})`,
      dossierPosition: (index, total) => `Expediente ${index} de ${total}`,
      prevRequest: 'Anterior',
      nextRequest: 'Siguiente',
      emptyFiltered: 'Sin coincidencias con los filtros activos.',
      clearFiltersBtn: 'Limpiar filtros',
      serviceLabel: 'Servicio asignado',
      modeLabel: 'Modalidad',
      dateLabel: 'Fecha',
      copyBtn: 'Copiar',
      copiedBtn: 'Copiado',
      openLinkBtn: 'Abrir enlace',
      deleteBtn: 'Eliminar',
      unsavedNotes: 'Sin guardar',
      hasNotesTag: 'Con notas',
      loadingDocs: 'Cargando expedientes...',
      emptyDocs: 'Sin expedientes registrados.',
      recentFallback: 'Reciente',
      confirmDelete: 'Confirmar borrado',
      cancelDelete: 'Cancelar',
      deleteAria: 'Eliminar expediente',
      modeAndTier: 'Modalidad y Servicio',
      soloShort: 'Personal',
      teamShort: 'Delegación',
      refLink: 'Perfil o dominio',
      reportedConcern: 'Contexto del titular',
      noComments: 'Sin notas registradas.',
      dossierStatus: 'Estado',
      closedLockedMsg: 'Expediente cerrado.',
      reopenBtn: 'Reabrir',
      internalNotesLabel: 'Notas internas',
      internalNotesPlaceholder: 'Acuerdos, responsable o seguimiento...',
      savingBtn: 'Guardando...',
      saveNotesBtn: 'Guardar notas',
      feedbackSyncError: 'Error al sincronizar expedientes.',
      feedbackStatusUpdated: (label) => `Estado cambiado a ${label}.`,
      feedbackStatusError: 'No se pudo actualizar el estado.',
      feedbackNotesSaved: 'Notas guardadas.',
      feedbackNotesError: 'No se pudieron guardar las notas.',
      feedbackDeleteError: 'No se pudo eliminar el expediente.',
    },
  },

  en: {
    metaTitle: 'Privado',
    raptorMetaTitle: 'Privado',
    crisisMetaTitle: 'Privado',
    nav: {
      overview: 'Home',
      profiles: 'Profiles',
      services: 'Tiers',
      units: 'Intelligence',
      pep: 'PEP',
      metrics: 'Metrics',
      backing: 'Infrastructure',
      raptor: 'Palantirr',
      crisis: 'Incident Protocol',
      evaluation: 'Assessment',
      cta: 'Request Assessment',
      mobileCta: 'Request Assessment',
      menuOpen: 'Menu',
      menuClose: 'Close',
      menuOpenAria: 'Open navigation menu',
      menuCloseAria: 'Close navigation menu',
      mobileUnitsLabel: 'On-demand units',
      mobileLangLabel: 'Language',
      ariaMain: 'Primary navigation',
      langSelectorAria: 'Select language',
    },
    hero: {
      headline: 'Your identity, armored. Your reputation, intact.',
      body: 'Corporate-grade cybersecurity and OSINT intelligence, dedicated exclusively to protecting your digital patrimony and your zero circle.',
      primaryCta: 'Request Assessment',
      emergencyTrigger: 'Active incident response',
      padlockAria: 'Optical personal vault sculpture',
    },
    profiles: {
      pitchLead:
        'An elite close-protection detail for your physical safety. A Swiss banker for your financial privacy.',
      pitchAnchor: 'Coto Privado for your digital identity.',
      pillarsLabel: 'Operating principles',
      pillars: [
        {
          num: '01',
          title: 'Digital Sovereignty',
          desc: 'Regain full control over what the internet knows about you and your family.',
        },
        {
          num: '02',
          title: 'Background Execution',
          desc: 'We neutralize threats before impact so you lead without disruption.',
        },
        {
          num: '03',
          title: 'Asymmetry in Your Favor',
          desc: 'We dedicate banking-grade defense infrastructure to your personal patrimony.',
        },
      ],
      audiencesLabel: 'Who we protect',
      audiences: [
        {
          id: 'pep',
          num: '01',
          title: 'Public Figures & PEPs',
          desc: 'We neutralize data leaks and reputational risks under public scrutiny.',
          cta: 'View PEP Protocol',
        },
        {
          id: 'creators',
          num: '02',
          title: 'Creators & Visionaries',
          desc: 'We prevent account hijacking, doxxing, and attacks on your revenue channels.',
          cta: 'Protect accounts',
        },
        {
          id: 'private',
          num: '03',
          title: 'Private Principals',
          desc: 'We remove exposed records and isolate your digital patrimony from third parties.',
          cta: 'Assess scope',
        },
      ],
    },
    services: {
      headline: 'Service Tiers',
      subtitle: 'Two defined scopes depending on whether you manage accounts directly or delegate access.',
      shieldAria: 'Optical asset shield sculpture',
      argos: {
        tierTag: 'Tier I',
        scopeTag: 'Personal Management',
        name: 'Argos',
        scopeSummary: 'Direct coverage across your personal accounts, devices, and exposed records.',
        bullets: [
          'We isolate your banking and personal accounts through segregated identities.',
          'We remove home addresses, phone numbers, and historical leaks from the web.',
          'We protect your phones and laptops against intrusion and session theft.',
          'We block SIM swapping and unauthorized account recovery attempts.',
        ],
        cta: 'Request Argos Tier',
      },
      atlas: {
        tierTag: 'Tier II',
        scopeTag: 'Access Delegation',
        name: 'Atlas',
        scopeSummary: 'Extended coverage for your family, assistants, and communications teams.',
        bullets: [
          'Includes the full Personal Management scope (Argos).',
          'We delegate social and press channels to your team without exposing master keys.',
          'We protect devices and accounts for your spouse, children, and zero circle.',
          'We isolate incidents and restore compromised assets in under 30 minutes.',
        ],
        cta: 'Request Atlas Tier',
      },
    },
    units: {
      headline: 'On-demand intelligence and critical response.',
      subtitle: 'Standalone units for high-stakes decisions or live incident containment.',
      palantirr: {
        num: '01',
        tag: 'Passive OSINT',
        name: 'Palantirr',
        summary:
          'We map every piece of data exposed online about you, your family, or a counterparty.',
        bullets: [
          'We audit leaks, public filings, and asset links without leaving a trace.',
          'We verify reputational risk prior to partnerships, investments, or agreements.',
          'We deliver an executive briefing with verified findings and removal steps.',
        ],
        cta: 'Explore Palantirr',
      },
      incidentProtocol: {
        num: '02',
        tag: 'Critical Response',
        name: 'Incident Protocol',
        summary:
          'Contain account takeovers, extortion, or active leaks within the first 30 minutes.',
        bullets: [
          'We isolate compromised devices and terminate intruder sessions immediately.',
          'We preserve admissible evidence and sever exposed cloud sharing links.',
          'We restore control over official profiles, domains, and mobile lines.',
        ],
        cta: 'Open Incident Protocol',
        emergencyLink: 'Direct Signal line',
      },
    },
    pep: {
      kicker: 'PEP Protocol',
      headline: 'Protect your family before stepping into public scrutiny.',
      body: 'We remove vulnerable records and secure your zero circle ahead of candidacies, public appointments, or asset disclosures.',
      cta: 'Request PEP Protocol',
      pillars: [
        {
          num: '01',
          title: 'Preventive Data Removal',
          desc: 'We purge private addresses, phone lines, and broker listings before launch.',
        },
        {
          num: '02',
          title: 'Boundary Between Law and Private Life',
          desc: 'We separate statutory public disclosures from your family private patrimony.',
        },
        {
          num: '03',
          title: 'Zero Circle Protection',
          desc: 'We harden mobile lines and devices for your spouse, children, and key advisors.',
        },
        {
          num: '04',
          title: 'Keyless Press Delegation',
          desc: 'We enable campaign teams to publish on verified accounts without master passwords.',
        },
      ],
      footnote: 'Strictly non-partisan under NDA · International coverage',
      raptorCta: 'Assess exposure with Palantirr',
    },
    metrics: {
      headline: 'Measurable reduction in 90 days.',
      scopeSelectorAria: 'Select profile',
      chartAria: 'Public exposure reduction curve from today to day 90',
      barsHeaderLeft: 'Protected areas',
      barsHeaderRight: 'Today → Day 90',
      cta: 'Assess my exposure',
      scopes: [
        {
          id: 'consolidated',
          tabLabel: 'Consolidated',
          headlineStat: '-92%',
          headlineLabel: 'of public footprint exposed',
          points: [
            { day: 0, label: 'Today', exposure: 100 },
            { day: 30, label: 'Day 30', exposure: 26 },
            { day: 90, label: 'Day 90', exposure: 8 },
          ],
          bars: [
            { label: 'Public addresses & phone numbers', before: 94, after: 8 },
            { label: 'Leaked passwords & accounts', before: 88, after: 4 },
            { label: 'Family & team account access', before: 91, after: 5 },
            { label: 'Mobile devices & carrier lines', before: 84, after: 6 },
          ],
          summaryNote:
            'Real cases under NDA · Containment in < 24 min · 0 shared passwords',
        },
        {
          id: 'pep',
          tabLabel: 'Public Figures',
          headlineStat: '-94%',
          headlineLabel: 'of traceable private records',
          points: [
            { day: 0, label: 'Today', exposure: 100 },
            { day: 30, label: 'Day 30', exposure: 19 },
            { day: 90, label: 'Day 90', exposure: 6 },
          ],
          bars: [
            { label: 'Home addresses & family records', before: 98, after: 6 },
            { label: 'Historical emails & archives', before: 86, after: 3 },
            { label: 'Press staff & advisor access', before: 95, after: 4 },
            { label: 'Zero circle mobile lines', before: 90, after: 5 },
          ],
          summaryNote:
            'Non-partisan under NDA · Response in < 18 min · 0 exposed passwords',
        },
        {
          id: 'atlas',
          tabLabel: 'Creators & Patrimony',
          headlineStat: '-89%',
          headlineLabel: 'of vulnerable attack surface',
          points: [
            { day: 0, label: 'Today', exposure: 100 },
            { day: 30, label: 'Day 30', exposure: 29 },
            { day: 90, label: 'Day 90', exposure: 11 },
          ],
          bars: [
            { label: 'Revenue channels & banking', before: 94, after: 3 },
            { label: 'Editors, agencies & assistants', before: 96, after: 4 },
            { label: 'Domains & primary email', before: 90, after: 8 },
            { label: 'Private life & personal assets', before: 85, after: 11 },
          ],
          summaryNote:
            'Zero daily friction · Containment in < 30 min · 0 leaked keys',
        },
      ],
    },
    raptor: {
      nav: {
        backToMain: 'Home',
        overview: 'Overview',
        capabilities: 'Scope',
        dossier: 'Briefing',
        evaluation: 'Intake',
        cta: 'Request Briefing',
      },
      hero: {
        kicker: 'Passive OSINT',
        name: 'Palantirr',
        subtitle: 'Complete assessment of your public online exposure.',
        body: 'We identify what data about you, your family, or a counterparty is accessible to third parties today, without alerting the target.',
        primaryCta: 'Request Palantirr Briefing',
        eyeAria: 'Optical passive analysis beacon',
      },
      capabilities: {
        headline: 'What we uncover',
        subtitle: 'Direct correlation across open records, historical breaches, and public filings.',
        items: [
          {
            num: '01',
            title: 'Counterparty Verification',
            desc: 'We vet backgrounds, litigation, and reputational links before signing agreements.',
          },
          {
            num: '02',
            title: 'Zero Circle Exposure',
            desc: 'We locate exposed home addresses, phone lines, and routines of your family.',
          },
          {
            num: '03',
            title: 'Leaked Credentials & Files',
            desc: 'We detect compromised passwords, indexed documents, and sensitive metadata.',
          },
          {
            num: '04',
            title: 'Impersonation & Mirror Domains',
            desc: 'We identify fake profiles and lookalike domains registered to exploit your name.',
          },
        ],
      },
      dossier: {
        kicker: 'Executive Deliverable',
        title: 'Exposure Briefing & Remediation Plan',
        body: 'Receive every verified finding ranked by severity alongside the exact steps to remove your exposed data.',
        cta: 'Request Palantirr Briefing',
      },
    },
    tech: {
      headline: 'Tailored Intelligence Infrastructure',
      body: 'We integrate banking-grade defense standards across your personal devices and accounts without daily friction.',
      partners: [
        {
          id: 'keeper',
          name: 'Keeper',
          role: 'Custody & delegation',
          desc: 'We secure master keys and delegate account access without revealing them.',
        },
        {
          id: 'cloudflare',
          name: 'Cloudflare',
          role: 'Network & domain shield',
          desc: 'We block phishing links, trackers, and attacks targeting your domains.',
        },
        {
          id: 'eset',
          name: 'ESET',
          role: 'Workstation defense',
          desc: 'We stop session theft and spyware across Mac and Windows.',
        },
        {
          id: 'action1',
          name: 'Action1',
          role: 'Vulnerability closure',
          desc: 'We patch critical application vulnerabilities automatically.',
        },
        {
          id: 'iverify',
          name: 'iVerify',
          role: 'Mobile integrity',
          desc: 'We detect advanced mobile intrusions across iPhone and Android.',
        },
      ],
    },
    form: {
      headline: 'Request Assessment',
      body: 'Provide your name, an alias, or a representative to structure your protection. We never request passwords.',
      raptorHeadline: 'Intake: Palantirr',
      raptorBody:
        'Provide a name, alias, or representative to scope your OSINT briefing under NDA.',
      crisisHeadline: 'Incident Response',
      crisisBody:
        'Log your case to trigger immediate technical containment and account recovery.',
      pepHeadline: 'Intake: PEP Protocol',
      pepBody:
        'Coordinate protection for yourself and your family ahead of a candidacy, appointment, or disclosure.',
      pepSwitchToGeneral: 'Switch to general assessment (Argos / Atlas)',
      fields: {
        nameLabel: 'Name, alias, or representative',
        namePlaceholder: 'e.g. M. Valdes',
        roleLabel: 'Primary activity or profile',
        rolePlaceholder: 'Public figure, Creator, Founder, Candidate...',
        refLabel: 'Reference profile or domain',
        refPlaceholder: '@handle or https://yourdomain.com',
        modeLabel: 'Scope',
        modeAria: 'Service scope',
        soloOption: 'Personal management',
        teamOption: 'With delegation',
        concernLabel: 'Priority or target date',
        optionalTag: 'Optional',
        concernPlaceholder: 'Primary objective or upcoming public milestone...',
        submitIdle: 'Request Assessment',
        raptorSubmitIdle: 'Request Palantirr Briefing',
        crisisSubmitIdle: 'Activate Containment',
        pepSubmitIdle: 'Request PEP Protocol',
        submitLoading: 'Recording request...',
      },
      validation: {
        errorPrefix: 'Check',
        nameLength: (min, max) =>
          `Enter a name, alias, or representative (${min} to ${max} characters).`,
        roleLength: (min, max) => `Enter your profile (${min} to ${max} characters).`,
        refEmpty: 'Enter a profile (@handle) or domain.',
        refInvalid: 'Enter a valid domain (e.g. yourdomain.com) or handle (@handle).',
        concernMax: (max) => `Maximum ${max} characters.`,
        idGenFailed: 'Could not generate case code. Please try again.',
        quotaExceeded: 'Daily intake reached. Contact us directly via Signal or email.',
        genericSubmitError: 'Could not submit request. Check your connection.',
      },
      confirmation: {
        title: 'Request Recorded',
        folioLabel: 'Case ID',
        tierLabel: 'Assigned scope',
        nameLabel: 'Principal / Alias',
        roleLabel: 'Profile',
        refLabel: 'Reference',
        modeLabel: 'Modality',
        modeSoloDesc: 'Personal management',
        modeTeamDesc: 'Access delegation',
        downloadBtn: 'Download receipt',
        emailBtn: 'Mail app',
        gmailBtn: 'Gmail Web',
        resetBtn: 'New request',
        tierDisplayArgos: 'Tier I · Argos',
        tierDisplayAtlas: 'Tier II · Atlas',
        tierDisplayRaptor: 'Palantirr',
        tierDisplayPep: 'PEP Protocol',
        receiptHeader: 'COTO PRIVADO · CASE RECORD',
        receiptFolio: 'Case ID',
        receiptDate: 'Date',
        receiptName: 'Principal / Alias',
        receiptRole: 'Profile',
        receiptRef: 'Reference',
        receiptMode: 'Modality',
        receiptModeSolo: 'Personal management',
        receiptModeTeam: 'Access delegation',
        receiptTier: 'Service',
        receiptNotes: 'Notes',
        receiptNoNotes: 'No additional notes',
        mailSubjectPrefix: 'Coto Privado Case',
        openSignalBtn: 'Open Signal',
      },
      signalCard: {
        emergencyToggle: 'Facing an active incident right now?',
        emergencyNotice:
          'Direct line for live account hijacking, active extortion, or imminent leaks.',
        emergencySignalLabel: 'Immediate response',
        emergencySignalSubtitle: 'Direct channel on Signal',
        unlockedKicker: (folio) => ['Direct channel active', `Case ${folio}`],
        unlockedTitle: 'Direct contact unlocked',
        unlockedBody: (folio) =>
          `Message us via Signal or email quoting case ${folio} to expedite handling.`,
        userLabel: 'Direct Signal',
        signalSubtitle: 'End-to-end encrypted',
        openSignalBtn: 'Open Signal',
        emailLabel: 'Direct email',
        openMailAppBtn: 'Mail app',
        openGmailBtn: 'Gmail Web',
        openOutlookBtn: 'Outlook Web',
        copyEmailBtn: 'Copy email',
        copiedEmailBtn: 'Copied',
        privacyTrigger: 'NDA & data handling',
      },
    },
    footer: {
      raptorLink: 'Palantirr',
      crisisLink: 'Incident Protocol',
      contactTrigger: 'Direct Line',
      privacyLink: 'NDA Terms',
      privateAccess: 'Access',
    },
    privacy: {
      dialogAria: 'Coto Privado NDA and data sovereignty terms',
      kicker: 'Coto Privado',
      title: 'NDA & Data Sovereignty',
      intro: 'We collect only the minimum information required to evaluate your case.',
      clauses: [
        {
          num: '01',
          title: 'Binding non-disclosure agreement (NDA)',
          desc: 'We protect your identity and your family from first contact under legal contract.',
        },
        {
          num: '02',
          title: 'Alias or representative intake',
          desc: 'We accept operational aliases and never share or monetize your data.',
        },
        {
          num: '03',
          title: 'Zero password requests on this site',
          desc: 'We never ask for passwords or SMS codes here; all technical coordination happens on Signal.',
        },
        {
          num: '04',
          title: 'Immediate deletion upon request',
          desc: 'You may order permanent deletion of your case record at any time.',
        },
      ],
      directLabel: 'Direct channel',
      openSignalBtn: 'Message on Signal',
      closeBtn: 'Close',
      closeAria: 'Close window',
    },
    emergencyModal: {
      dialogAria: 'Immediate response for active incidents',
      kicker: 'Critical Response',
      title: 'Active incident response',
      body: 'If you are facing live account theft, extortion, or data leakage, connect directly with a specialist.',
      signalLabel: 'On-duty specialist',
      signalSubtitle: 'Direct communication via Signal',
      openSignalBtn: 'Connect on Signal',
      crisisGuideCta: 'View steps for the first 30 minutes',
      preventivePrompt: 'Looking for preventive protection?',
      preventiveCta: 'Go to Request Assessment',
      privacyLink: 'NDA Terms',
      closeAria: 'Close window',
    },
    crisisPage: {
      nav: {
        backToMain: 'Home',
        overview: 'Overview',
        protocol: 'Steps',
        hygiene: 'Rules',
        evaluation: 'Support',
        cta: 'Request Containment',
      },
      hero: {
        kicker: 'First 30 Minutes',
        headline: 'Contain an attack on your accounts before it escalates.',
        body: 'Follow this exact sequence and use verified official portals to halt damage and preserve evidence.',
        primaryCta: 'View action steps',
        signalCta: 'Direct Signal line',
        chamberAria: 'Optical containment chamber sculpture',
      },
      protocol: {
        kicker: 'Immediate Action',
        title: 'Select the active incident',
        subtitle: 'Execute each step in order and access official recovery portals directly.',
        tabAria: 'Incident types',
        resourcesTitle: 'Official recovery portals',
        resourcesNote: 'Verified direct access',
        helpPrompt: 'Need our team to take technical control?',
        helpCta: 'Request intervention',
        scenarios: [
          {
            id: 'hack',
            label: 'Account takeover',
            steps: [
              {
                num: '01',
                title: 'Disconnect the affected device without wiping it',
                desc: 'Turn off Wi-Fi and cellular data immediately; changing passwords on an infected device hands them to the attacker.',
              },
              {
                num: '02',
                title: 'Secure your root email from a clean device',
                desc: 'Reset your primary email password from a separate device, revoke sessions, and remove hidden forwarding rules.',
              },
              {
                num: '03',
                title: 'Revoke sessions and switch from SMS to hardware or app 2FA',
                desc: 'Unlink unknown devices on WhatsApp, Google, Apple, or Meta and enable authenticator verification.',
              },
              {
                num: '04',
                title: 'Lock your mobile line and alert your private bank',
                desc: 'If cellular service dropped suddenly, instruct your carrier to block SIM swaps and freeze outbound wires.',
              },
            ],
            avoidLabel: 'What to avoid',
            avoidAction:
              'Never pay self-proclaimed recovery agents on social media; no external party holds legitimate access.',
            resources: [
              {
                name: 'Google Security Checkup',
                desc: 'Session termination, mail filters, and app permissions',
                url: 'https://myaccount.google.com/security-checkup',
              },
              {
                name: 'Apple Account Recovery',
                desc: 'Official Apple ID recovery and trusted devices',
                url: 'https://iforgot.apple.com/',
              },
              {
                name: 'Microsoft Security',
                desc: 'Sign-in history and global session sign-out',
                url: 'https://account.microsoft.com/security',
              },
              {
                name: 'Meta Account Recovery',
                desc: 'Official recovery for Instagram and Facebook',
                url: 'https://www.instagram.com/hacked/',
              },
            ],
          },
          {
            id: 'extortion',
            label: 'Doxxing or extortion',
            steps: [
              {
                num: '01',
                title: 'Verify whether the breach is real or an automated bluff',
                desc: 'Most extortion emails quote old leaked passwords to fake live control over your device.',
              },
              {
                num: '02',
                title: 'Preserve original messages without editing them',
                desc: 'Export emails as .eml files and capture full URLs and timestamps intact.',
              },
              {
                num: '03',
                title: 'Sever shared folders and links in your cloud',
                desc: 'From a clean device, revoke active share links across Google Drive, iCloud, Dropbox, or Notion.',
              },
              {
                num: '04',
                title: 'Never wire funds while the breach remains open',
                desc: 'Paying before closing intruder access never stops publication and invites repeat demands.',
              },
            ],
            avoidLabel: 'What to avoid',
            avoidAction:
              'Do not reply or negotiate while unauthorized sessions persist in your email or cloud backups.',
            resources: [
              {
                name: 'Have I Been Pwned',
                desc: 'Historical breach verification for your email',
                url: 'https://haveibeenpwned.com/',
              },
              {
                name: 'Google Security Checkup',
                desc: 'Audit third-party apps reading your files and mail',
                url: 'https://myaccount.google.com/security-checkup',
              },
              {
                name: 'Google Content Removal',
                desc: 'Removal of exposed personal data from search',
                url: 'https://reportcontent.google.com/',
              },
              {
                name: 'StopNCII.org',
                desc: 'Preventive hash blocking for intimate media',
                url: 'https://stopncii.org/',
              },
            ],
          },
          {
            id: 'reputation',
            label: 'Impersonation',
            steps: [
              {
                num: '01',
                title: 'Archive fraudulent URLs before reporting them',
                desc: 'Record timestamped evidence of the exact URL before requesting takedowns.',
              },
              {
                num: '02',
                title: 'Identify the registrar hosting the fake domain',
                desc: 'Query ICANN to file registrar abuse takedowns and flag the site in browsers.',
              },
              {
                num: '03',
                title: 'Alert your family and staff by voice call',
                desc: 'Impersonators contact your circle simultaneously requesting urgent wires or codes.',
              },
              {
                num: '04',
                title: 'Clarify from your verified account without linking the scam',
                desc: 'Post a brief notice from your official profile without driving traffic to the fake URL.',
              },
            ],
            avoidLabel: 'What to avoid',
            avoidAction:
              'Do not open suspicious links from your home or mobile network; trap pages log your real IP.',
            resources: [
              {
                name: 'ICANN Registration Lookup',
                desc: 'Identify the registrar behind a fraudulent domain',
                url: 'https://lookup.icann.org/',
              },
              {
                name: 'Google Safe Browsing',
                desc: 'Flag phishing pages across browsers',
                url: 'https://safebrowsing.google.com/safebrowsing/report_phish/',
              },
              {
                name: 'Wayback Machine Save',
                desc: 'Timestamped web archive prior to takedown',
                url: 'https://web.archive.org/save',
              },
              {
                name: 'Google Legal Removal',
                desc: 'Legal removal for impersonation or defamation',
                url: 'https://reportcontent.google.com/',
              },
            ],
          },
        ],
      },
      hygiene: {
        headline: 'Four permanent rules of control',
        subtitle: 'Direct habits that neutralize the vast majority of targeted attacks.',
        items: [
          {
            num: '01',
            title: 'Isolate one dedicated email for banking and patrimony',
            desc: 'Never use your public email address for banking, investments, or core domains.',
          },
          {
            num: '02',
            title: 'Eliminate SMS as a security factor',
            desc: 'Protect critical accounts with hardware security keys or authenticator apps.',
          },
          {
            num: '03',
            title: 'Delegate access without sharing passwords',
            desc: 'Grant revocable permissions to staff through custody vaults.',
          },
          {
            num: '04',
            title: 'Verify any financial urgency by voice call',
            desc: 'Always confirm unusual requests for funds or documents over a direct phone call.',
          },
        ],
        auditCta: 'Protect my personal perimeter',
      },
    },
    admin: {
      dialogAria: 'Coto Privado case inbox',
      headerTitle: 'Cases · Coto Privado',
      exportCsv: 'Export CSV',
      signOut: 'Sign out',
      closeAria: 'Close panel',
      verifying: 'Verifying credentials...',
      signInTitle: 'Authorized Access',
      signInDesc: 'Sign in with your @coto.lat account to manage case records.',
      signInBtn: 'Sign in with Google',
      signInFailed: 'Authentication could not be completed.',
      unauthorizedTitle: 'Unauthorized account',
      unauthorizedPrefix: 'Active session',
      unauthorizedMiddle: 'is not authorized. Sign in with an account under',
      switchAccountBtn: 'Switch account',
      tabs: {
        all: (count) => `All (${count})`,
        pendiente: (count) => `Pending (${count})`,
        en_revision: (count) => `In review (${count})`,
        contactado: (count) => `Contacted (${count})`,
        cerrado: (count) => `Closed (${count})`,
      },
      statusLabels: {
        pendiente: 'Pending',
        en_revision: 'In review',
        contactado: 'Contacted',
        cerrado: 'Closed',
      },
      searchPlaceholder: 'Filter by case ID, name, profile, or notes...',
      clearSearchAria: 'Clear search',
      serviceFilterAria: 'Filter by service',
      serviceAll: 'All services',
      sortNewest: 'Newest',
      sortOldest: 'Oldest',
      queueCount: (shown, total) =>
        shown === total
          ? `${total} ${total === 1 ? 'case' : 'cases'}`
          : `${shown} of ${total} cases`,
      selectPrompt: 'Select a case',
      openDossier: 'Open',
      backToList: (count) => `Back (${count})`,
      dossierPosition: (index, total) => `Case ${index} of ${total}`,
      prevRequest: 'Previous',
      nextRequest: 'Next',
      emptyFiltered: 'No cases match active filters.',
      clearFiltersBtn: 'Reset filters',
      serviceLabel: 'Assigned service',
      modeLabel: 'Modality',
      dateLabel: 'Date',
      copyBtn: 'Copy',
      copiedBtn: 'Copied',
      openLinkBtn: 'Open link',
      deleteBtn: 'Delete',
      unsavedNotes: 'Unsaved',
      hasNotesTag: 'With notes',
      loadingDocs: 'Loading cases...',
      emptyDocs: 'No cases recorded.',
      recentFallback: 'Recent',
      confirmDelete: 'Confirm delete',
      cancelDelete: 'Cancel',
      deleteAria: 'Delete case',
      modeAndTier: 'Modality & Service',
      soloShort: 'Personal',
      teamShort: 'Delegation',
      refLink: 'Profile or domain',
      reportedConcern: 'Principal context',
      noComments: 'No notes recorded.',
      dossierStatus: 'Status',
      closedLockedMsg: 'Case closed.',
      reopenBtn: 'Reopen',
      internalNotesLabel: 'Internal notes',
      internalNotesPlaceholder: 'Agreements, owner, or next steps...',
      savingBtn: 'Saving...',
      saveNotesBtn: 'Save notes',
      feedbackSyncError: 'Failed to sync cases.',
      feedbackStatusUpdated: (label) => `Status set to ${label}.`,
      feedbackStatusError: 'Could not update status.',
      feedbackNotesSaved: 'Notes saved.',
      feedbackNotesError: 'Could not save notes.',
      feedbackDeleteError: 'Could not delete case.',
    },
  },

  pt: {
    metaTitle: 'Privado',
    raptorMetaTitle: 'Privado',
    crisisMetaTitle: 'Privado',
    nav: {
      overview: 'Início',
      profiles: 'Perfis',
      services: 'Níveis',
      units: 'Inteligência',
      pep: 'PEP',
      metrics: 'Métricas',
      backing: 'Infraestrutura',
      raptor: 'Palantirr',
      crisis: 'Protocolo de Incidentes',
      evaluation: 'Avaliação',
      cta: 'Solicitar Avaliação',
      mobileCta: 'Solicitar Avaliação',
      menuOpen: 'Menu',
      menuClose: 'Fechar',
      menuOpenAria: 'Abrir menu de navegação',
      menuCloseAria: 'Fechar menu de navegação',
      mobileUnitsLabel: 'Unidades sob demanda',
      mobileLangLabel: 'Idioma',
      ariaMain: 'Navegação principal',
      langSelectorAria: 'Selecionar idioma',
    },
    hero: {
      headline: 'Sua identidade, blindada. Sua reputação, intacta.',
      body: 'Cibersegurança e inteligência OSINT de grau corporativo, dedicadas exclusivamente a proteger seu patrimônio digital e seu círculo zero.',
      primaryCta: 'Solicitar Avaliação',
      emergencyTrigger: 'Atendimento a incidentes',
      padlockAria: 'Escultura óptica de cofre pessoal',
    },
    profiles: {
      pitchLead:
        'Uma escolta de elite para sua segurança física. Um banqueiro suíço para sua privacidade financeira.',
      pitchAnchor: 'Coto Privado para sua identidade digital.',
      pillarsLabel: 'Princípios operacionais',
      pillars: [
        {
          num: '01',
          title: 'Soberania Digital',
          desc: 'Recupere o controle total sobre o que a internet sabe sobre você e sua família.',
        },
        {
          num: '02',
          title: 'Execução em Segundo Plano',
          desc: 'Neutralizamos riscos antes do impacto para que você lidere sem interrupções.',
        },
        {
          num: '03',
          title: 'Assimetria a seu Favor',
          desc: 'Dedicamos infraestrutura de defesa bancária para proteger seu patrimônio pessoal.',
        },
      ],
      audiencesLabel: 'Quem protegemos',
      audiences: [
        {
          id: 'pep',
          num: '01',
          title: 'Figuras Públicas e PEPs',
          desc: 'Neutralizamos vazamentos e riscos reputacionais sob escrutínio público.',
          cta: 'Ver Protocolo PEP',
        },
        {
          id: 'creators',
          num: '02',
          title: 'Criadores e Visionários',
          desc: 'Impedimos sequestro de contas, doxxing e ataques às suas fontes de receita.',
          cta: 'Proteger contas',
        },
        {
          id: 'private',
          num: '03',
          title: 'Interesses Privados',
          desc: 'Removemos registros expostos e isolamos seu patrimônio digital de terceiros.',
          cta: 'Avaliar escopo',
        },
      ],
    },
    services: {
      headline: 'Níveis de Serviço',
      subtitle: 'Dois escopos definidos conforme gerencie suas contas diretamente ou delegue acessos.',
      shieldAria: 'Escultura óptica de blindagem de ativos',
      argos: {
        tierTag: 'Nível I',
        scopeTag: 'Gestão Pessoal',
        name: 'Argos',
        scopeSummary: 'Cobertura direta sobre suas contas, dispositivos e registros pessoais.',
        bullets: [
          'Isolamos suas contas bancárias e pessoais por meio de identidades separadas.',
          'Removemos endereços, telefones e vazamentos históricos expostos na rede.',
          'Protegemos seus celulares e notebooks contra intrusões e roubo de sessão.',
          'Bloqueamos clonagem de linha móvel e tentativas de acesso não autorizado.',
        ],
        cta: 'Solicitar Nível Argos',
      },
      atlas: {
        tierTag: 'Nível II',
        scopeTag: 'Delegação de Acessos',
        name: 'Atlas',
        scopeSummary: 'Cobertura estendida à sua família, assistentes e equipes de comunicação.',
        bullets: [
          'Inclui todo o escopo de Gestão Pessoal (Argos).',
          'Delegamos redes e canais à sua equipe sem revelar senhas mestras.',
          'Protegemos os dispositivos e contas de cônjuge, filhos e círculo zero.',
          'Isolamos incidentes e restituímos ativos comprometidos em menos de 30 minutos.',
        ],
        cta: 'Solicitar Nível Atlas',
      },
    },
    units: {
      headline: 'Inteligência sob demanda e resposta crítica.',
      subtitle: 'Unidades de ativação direta para decisões estratégicas ou contenção de incidentes.',
      palantirr: {
        num: '01',
        tag: 'OSINT Passivo',
        name: 'Palantirr',
        summary:
          'Identificamos com precisão o que a internet expõe hoje sobre você, sua família ou uma contraparte.',
        bullets: [
          'Auditamos vazamentos, registros públicos e vínculos patrimoniais sem deixar rastro.',
          'Verificamos riscos reputacionais antes de firmar alianças, investimentos ou acordos.',
          'Entregamos um relatório executivo com achados verificados e rota de remoção.',
        ],
        cta: 'Explorar Palantirr',
      },
      incidentProtocol: {
        num: '02',
        tag: 'Resposta Crítica',
        name: 'Protocolo de Incidentes',
        summary:
          'Contenha sequestro de contas, extorsão ou vazamentos durante os primeiros 30 minutos.',
        bullets: [
          'Isolamos dispositivos afetados e encerramos sessões intrusas imediatamente.',
          'Preservamos provas íntegras e cortamos links abertos na sua nuvem pessoal.',
          'Restituímos o controle de perfis oficiais, domínios e linhas móveis.',
        ],
        cta: 'Abrir Protocolo de Incidentes',
        emergencyLink: 'Linha direta no Signal',
      },
    },
    pep: {
      kicker: 'Protocolo PEP',
      headline: 'Proteja sua família antes de entrar no escrutínio público.',
      body: 'Removemos dados vulneráveis e blindamos seu círculo zero antes de candidaturas, cargos públicos ou declarações patrimoniais.',
      cta: 'Solicitar Protocolo PEP',
      pillars: [
        {
          num: '01',
          title: 'Remoção Preventiva de Dados',
          desc: 'Eliminamos endereços, telefones privados e registros expostos antes do anúncio.',
        },
        {
          num: '02',
          title: 'Fronteira entre Lei e Vida Privada',
          desc: 'Separamos a transparência legal do patrimônio privado da sua família.',
        },
        {
          num: '03',
          title: 'Proteção do Círculo Zero',
          desc: 'Protegemos celulares e linhas móveis de cônjuge, filhos e assessores diretos.',
        },
        {
          num: '04',
          title: 'Delegação de Imprensa sem Senhas',
          desc: 'Habilitamos sua equipe de campanha a publicar sem possuir chaves mestras.',
        },
      ],
      footnote: 'Atuação apartidária sob acordo NDA · Cobertura internacional',
      raptorCta: 'Analisar exposição com Palantirr',
    },
    metrics: {
      headline: 'Redução real em 90 dias.',
      scopeSelectorAria: 'Selecionar perfil',
      chartAria: 'Curva de redução de exposição pública entre hoje e o dia 90',
      barsHeaderLeft: 'Frentes protegidas',
      barsHeaderRight: 'Hoje → Dia 90',
      cta: 'Avaliar minha exposição',
      scopes: [
        {
          id: 'consolidated',
          tabLabel: 'Consolidado',
          headlineStat: '-92%',
          headlineLabel: 'da exposição pública',
          points: [
            { day: 0, label: 'Hoje', exposure: 100 },
            { day: 30, label: 'Dia 30', exposure: 26 },
            { day: 90, label: 'Dia 90', exposure: 8 },
          ],
          bars: [
            { label: 'Endereços e telefones públicos', before: 94, after: 8 },
            { label: 'Senhas e contas vazadas', before: 88, after: 4 },
            { label: 'Acessos da família e equipe', before: 91, after: 5 },
            { label: 'Celulares e linhas móveis', before: 84, after: 6 },
          ],
          summaryNote:
            'Casos reais sob NDA · Contenção em < 24 min · 0 senhas compartilhadas',
        },
        {
          id: 'pep',
          tabLabel: 'Figuras Públicas',
          headlineStat: '-94%',
          headlineLabel: 'do rastro privado localizável',
          points: [
            { day: 0, label: 'Hoje', exposure: 100 },
            { day: 30, label: 'Dia 30', exposure: 19 },
            { day: 90, label: 'Dia 90', exposure: 6 },
          ],
          bars: [
            { label: 'Endereços e registros familiares', before: 98, after: 6 },
            { label: 'E-mails e arquivos históricos', before: 86, after: 3 },
            { label: 'Imprensa e assessores com acesso', before: 95, after: 4 },
            { label: 'Linhas móveis do círculo zero', before: 90, after: 5 },
          ],
          summaryNote:
            'Atuação apartidária sob NDA · Resposta em < 18 min · 0 senhas expostas',
        },
        {
          id: 'atlas',
          tabLabel: 'Criadores e Patrimônio',
          headlineStat: '-89%',
          headlineLabel: 'da superfície vulnerável',
          points: [
            { day: 0, label: 'Hoje', exposure: 100 },
            { day: 30, label: 'Dia 30', exposure: 29 },
            { day: 90, label: 'Dia 90', exposure: 11 },
          ],
          bars: [
            { label: 'Canais de receita e bancos', before: 94, after: 3 },
            { label: 'Editores, agências e assistentes', before: 96, after: 4 },
            { label: 'Domínios e e-mail principal', before: 90, after: 8 },
            { label: 'Vida privada e patrimônio', before: 85, after: 11 },
          ],
          summaryNote:
            'Proteção sem atrito diário · Contenção em < 30 min · 0 chaves vazadas',
        },
      ],
    },
    raptor: {
      nav: {
        backToMain: 'Início',
        overview: 'Resumo',
        capabilities: 'Escopo',
        dossier: 'Relatório',
        evaluation: 'Admissão',
        cta: 'Solicitar Relatório',
      },
      hero: {
        kicker: 'OSINT Passivo',
        name: 'Palantirr',
        subtitle: 'Radiografia exata da sua exposição na internet.',
        body: 'Identificamos quais dados seus, da sua família ou de uma contraparte estão hoje acessíveis a terceiros, sem alertar o alvo.',
        primaryCta: 'Solicitar Relatório Palantirr',
        eyeAria: 'Farol óptico de análise passiva',
      },
      capabilities: {
        headline: 'O que revelamos',
        subtitle: 'Correlação direta sobre fontes abertas, vazamentos históricos e registros públicos.',
        items: [
          {
            num: '01',
            title: 'Verificação de Contrapartes',
            desc: 'Avaliamos antecedentes, litígios e vínculos reputacionais antes de firmar acordos.',
          },
          {
            num: '02',
            title: 'Exposição do Círculo Zero',
            desc: 'Localizamos endereços, telefones e rotinas expostas de você e sua família.',
          },
          {
            num: '03',
            title: 'Credenciais e Arquivos Vazados',
            desc: 'Detectamos senhas comprometidas, documentos indexados e metadados sensíveis.',
          },
          {
            num: '04',
            title: 'Falsificação e Domínios Espelho',
            desc: 'Identificamos perfis falsos e domínios criados para usurpar sua identidade.',
          },
        ],
      },
      dossier: {
        kicker: 'Entregável Executivo',
        title: 'Relatório de Exposição e Plano de Remoção',
        body: 'Receba cada achado verificado por severidade junto com as ações exatas para retirar suas informações.',
        cta: 'Solicitar Relatório Palantirr',
      },
    },
    tech: {
      headline: 'Infraestrutura de Inteligência sob Medida',
      body: 'Integramos padrões de defesa bancária aos seus dispositivos e contas pessoais sem atrito diário.',
      partners: [
        {
          id: 'keeper',
          name: 'Keeper',
          role: 'Custódia e delegação',
          desc: 'Protegemos chaves mestras e delegamos acessos sem revelá-las.',
        },
        {
          id: 'cloudflare',
          name: 'Cloudflare',
          role: 'Blindagem de rede e domínios',
          desc: 'Bloqueamos links falsos, rastreadores e ataques aos seus domínios.',
        },
        {
          id: 'eset',
          name: 'ESET',
          role: 'Defesa de computadores',
          desc: 'Impedimos roubo de sessão e spyware em Mac e Windows.',
        },
        {
          id: 'action1',
          name: 'Action1',
          role: 'Fechamento de brechas',
          desc: 'Corrigimos vulnerabilidades críticas nos seus aplicativos automaticamente.',
        },
        {
          id: 'iverify',
          name: 'iVerify',
          role: 'Integridade móvel',
          desc: 'Detectamos intrusões avançadas no iPhone e Android.',
        },
      ],
    },
    form: {
      headline: 'Solicitar Avaliação',
      body: 'Informe seu nome, um alias ou representante para estruturar sua proteção. Nunca solicitamos senhas.',
      raptorHeadline: 'Admissão: Palantirr',
      raptorBody:
        'Informe um nome, alias ou representante para definir o escopo do seu relatório OSINT sob NDA.',
      crisisHeadline: 'Atendimento a Incidentes',
      crisisBody:
        'Registre sua situação para ativar contenção técnica imediata e restituição de contas.',
      pepHeadline: 'Admissão: Protocolo PEP',
      pepBody:
        'Coordene a proteção sua e da sua família antes de uma candidatura, cargo público ou declaração patrimonial.',
      pepSwitchToGeneral: 'Mudar para avaliação geral (Argos / Atlas)',
      fields: {
        nameLabel: 'Nome, alias ou representante',
        namePlaceholder: 'Ex. M. Valdés',
        roleLabel: 'Atividade ou perfil',
        rolePlaceholder: 'Figura pública, Criador, Empresário, Candidatura...',
        refLabel: 'Perfil ou domínio de referência',
        refPlaceholder: '@usuario ou https://seudominio.com',
        modeLabel: 'Escopo',
        modeAria: 'Escopo do serviço',
        soloOption: 'Gestão pessoal',
        teamOption: 'Com delegação',
        concernLabel: 'Prioridade ou data-chave',
        optionalTag: 'Opcional',
        concernPlaceholder: 'Objetivo principal ou próximo anúncio público...',
        submitIdle: 'Solicitar Avaliação',
        raptorSubmitIdle: 'Solicitar Relatório Palantirr',
        crisisSubmitIdle: 'Ativar Contenção',
        pepSubmitIdle: 'Solicitar Protocolo PEP',
        submitLoading: 'Registrando solicitação...',
      },
      validation: {
        errorPrefix: 'Verificação',
        nameLength: (min, max) =>
          `Informe um nome, alias ou representante (${min} a ${max} caracteres).`,
        roleLength: (min, max) => `Informe seu perfil (${min} a ${max} caracteres).`,
        refEmpty: 'Informe um perfil (@usuario) ou domínio.',
        refInvalid: 'Insira um domínio válido (ex. seudominio.com) ou perfil (@usuario).',
        concernMax: (max) => `Máximo de ${max} caracteres.`,
        idGenFailed: 'Não foi possível gerar o código do processo. Tente novamente.',
        quotaExceeded: 'Limite diário atingido. Fale conosco pelo Signal ou e-mail.',
        genericSubmitError: 'Não foi possível enviar a solicitação. Verifique sua conexão.',
      },
      confirmation: {
        title: 'Solicitação Registrada',
        folioLabel: 'Processo',
        tierLabel: 'Escopo atribuído',
        nameLabel: 'Titular / Alias',
        roleLabel: 'Perfil',
        refLabel: 'Referência',
        modeLabel: 'Modalidade',
        modeSoloDesc: 'Gestão pessoal',
        modeTeamDesc: 'Delegação de acessos',
        downloadBtn: 'Baixar comprovante',
        emailBtn: 'App de e-mail',
        gmailBtn: 'Gmail Web',
        resetBtn: 'Nova solicitação',
        tierDisplayArgos: 'Nível I · Argos',
        tierDisplayAtlas: 'Nível II · Atlas',
        tierDisplayRaptor: 'Palantirr',
        tierDisplayPep: 'Protocolo PEP',
        receiptHeader: 'COTO PRIVADO · COMPROVANTE DE PROCESSO',
        receiptFolio: 'Processo',
        receiptDate: 'Data',
        receiptName: 'Titular / Alias',
        receiptRole: 'Perfil',
        receiptRef: 'Referência',
        receiptMode: 'Modalidade',
        receiptModeSolo: 'Gestão pessoal',
        receiptModeTeam: 'Delegação de acessos',
        receiptTier: 'Serviço',
        receiptNotes: 'Notas',
        receiptNoNotes: 'Sem notas adicionais',
        mailSubjectPrefix: 'Processo Coto Privado',
        openSignalBtn: 'Abrir Signal',
      },
      signalCard: {
        emergencyToggle: 'Enfrenta um incidente ativo neste momento?',
        emergencyNotice:
          'Canal direto para sequestro de contas em curso, extorsão ativa ou vazamento iminente.',
        emergencySignalLabel: 'Resposta imediata',
        emergencySignalSubtitle: 'Canal direto no Signal',
        unlockedKicker: (folio) => ['Canal direto habilitado', `Processo ${folio}`],
        unlockedTitle: 'Contato direto disponível',
        unlockedBody: (folio) =>
          `Escreva pelo Signal ou e-mail informando seu processo ${folio} para agilizar o atendimento.`,
        userLabel: 'Signal direto',
        signalSubtitle: 'Criptografia de ponta a ponta',
        openSignalBtn: 'Abrir Signal',
        emailLabel: 'E-mail direto',
        openMailAppBtn: 'App de e-mail',
        openGmailBtn: 'Gmail Web',
        openOutlookBtn: 'Outlook Web',
        copyEmailBtn: 'Copiar e-mail',
        copiedEmailBtn: 'Copiado',
        privacyTrigger: 'Acordo NDA e tratamento de dados',
      },
    },
    footer: {
      raptorLink: 'Palantirr',
      crisisLink: 'Protocolo de Incidentes',
      contactTrigger: 'Linha Direta',
      privacyLink: 'Acordo NDA',
      privateAccess: 'Acesso',
    },
    privacy: {
      dialogAria: 'Acordo NDA e soberania de dados da Coto Privado',
      kicker: 'Coto Privado',
      title: 'Acordo NDA e Soberania de Dados',
      intro: 'Coletamos apenas os dados mínimos necessários para avaliar o seu caso.',
      clauses: [
        {
          num: '01',
          title: 'Acordo legal de não divulgação (NDA)',
          desc: 'Protegemos sua identidade e a da sua família desde o primeiro contato sob contrato legal.',
        },
        {
          num: '02',
          title: 'Admissão por alias ou representante',
          desc: 'Aceitamos aliases operacionais e jamais compartilhamos ou comercializamos seus dados.',
        },
        {
          num: '03',
          title: 'Zero solicitação de senhas neste site',
          desc: 'Nunca pedimos senhas ou códigos SMS aqui; toda coordenação técnica ocorre via Signal.',
        },
        {
          num: '04',
          title: 'Exclusão imediata mediante solicitação',
          desc: 'Você pode ordenar a exclusão definitiva do seu registro a qualquer momento.',
        },
      ],
      directLabel: 'Canal direto',
      openSignalBtn: 'Falar no Signal',
      closeBtn: 'Fechar',
      closeAria: 'Fechar janela',
    },
    emergencyModal: {
      dialogAria: 'Atendimento imediato a incidentes ativos',
      kicker: 'Resposta Crítica',
      title: 'Atendimento imediato a incidentes',
      body: 'Se sofre roubo de contas, extorsão ou vazamento em curso, fale diretamente com um especialista.',
      signalLabel: 'Especialista de plantão',
      signalSubtitle: 'Comunicação direta via Signal',
      openSignalBtn: 'Conectar no Signal',
      crisisGuideCta: 'Ver passos para os primeiros 30 minutos',
      preventivePrompt: 'Busca proteção preventiva?',
      preventiveCta: 'Ir para Solicitar Avaliação',
      privacyLink: 'Acordo NDA',
      closeAria: 'Fechar janela',
    },
    crisisPage: {
      nav: {
        backToMain: 'Início',
        overview: 'Resumo',
        protocol: 'Passos',
        hygiene: 'Regras',
        evaluation: 'Assistência',
        cta: 'Solicitar Contenção',
      },
      hero: {
        kicker: 'Primeiros 30 Minutos',
        headline: 'Contenha um ataque às suas contas antes que escale.',
        body: 'Siga esta sequência exata e utilize apenas portais oficiais para frear danos e preservar provas.',
        primaryCta: 'Ver passos de ação',
        signalCta: 'Linha direta no Signal',
        chamberAria: 'Escultura óptica de câmara de contenção',
      },
      protocol: {
        kicker: 'Ação Imediata',
        title: 'Selecione o incidente em curso',
        subtitle: 'Execute cada passo em ordem e acesse diretamente os portais oficiais.',
        tabAria: 'Tipos de incidente',
        resourcesTitle: 'Portais oficiais de recuperação',
        resourcesNote: 'Acesso direto verificado',
        helpPrompt: 'Precisa que assumamos o controle técnico?',
        helpCta: 'Solicitar intervenção',
        scenarios: [
          {
            id: 'hack',
            label: 'Sequestro de contas',
            steps: [
              {
                num: '01',
                title: 'Desconecte a internet do aparelho sem formatá-lo',
                desc: 'Desligue Wi-Fi e dados imediatamente; trocar senhas num aparelho infectado as entrega ao invasor.',
              },
              {
                num: '02',
                title: 'Proteja seu e-mail principal por um dispositivo limpo',
                desc: 'Altere a senha em outro aparelho, encerre sessões ativas e remova redirecionamentos ocultos.',
              },
              {
                num: '03',
                title: 'Revogue sessões e migre do SMS para chave ou app 2FA',
                desc: 'Desvincule aparelhos estranhos no WhatsApp, Google, Apple ou Meta e ative app autenticador.',
              },
              {
                num: '04',
                title: 'Bloqueie sua linha móvel e avise seu banco',
                desc: 'Se perdeu sinal celular, exija bloqueio contra troca de chip na operadora e trave transferências.',
              },
            ],
            avoidLabel: 'O que evitar',
            avoidAction:
              'Nunca pague a supostos recuperadores em redes sociais; nenhum terceiro externo possui acesso legítimo.',
            resources: [
              {
                name: 'Google Security Checkup',
                desc: 'Encerramento de sessões, filtros e permissões',
                url: 'https://myaccount.google.com/security-checkup',
              },
              {
                name: 'Apple Account Recovery',
                desc: 'Recuperação oficial de Apple ID e aparelhos confiáveis',
                url: 'https://iforgot.apple.com/',
              },
              {
                name: 'Microsoft Security',
                desc: 'Histórico de acessos e encerramento global de sessões',
                url: 'https://account.microsoft.com/security',
              },
              {
                name: 'Meta Account Recovery',
                desc: 'Recuperação oficial para Instagram e Facebook',
                url: 'https://www.instagram.com/hacked/',
              },
            ],
          },
          {
            id: 'extortion',
            label: 'Doxxing ou extorsão',
            steps: [
              {
                num: '01',
                title: 'Verifique se o vazamento é real ou um blefe automático',
                desc: 'Muitas extorsões citam senhas antigas vazadas para simular controle atual do seu equipamento.',
              },
              {
                num: '02',
                title: 'Preserve as mensagens originais sem editá-las',
                desc: 'Baixe os e-mails em formato .eml e registre capturas com data, hora e links completos.',
              },
              {
                num: '03',
                title: 'Corte pastas e links públicos na sua nuvem',
                desc: 'De um aparelho limpo, revogue links ativos no Google Drive, iCloud, Dropbox ou Notion.',
              },
              {
                num: '04',
                title: 'Não transfira valores sem antes fechar a brecha',
                desc: 'Pagar com o acesso intruso aberto nunca impede a divulgação e gera novas cobranças.',
              },
            ],
            avoidLabel: 'O que evitar',
            avoidAction:
              'Não responda nem negocie enquanto persistirem sessões abertas no seu e-mail ou nuvem.',
            resources: [
              {
                name: 'Have I Been Pwned',
                desc: 'Consulta de vazamentos históricos do seu e-mail',
                url: 'https://haveibeenpwned.com/',
              },
              {
                name: 'Google Security Checkup',
                desc: 'Auditoria de aplicativos com acesso aos seus arquivos',
                url: 'https://myaccount.google.com/security-checkup',
              },
              {
                name: 'Google Content Removal',
                desc: 'Remoção de dados pessoais expostos na busca',
                url: 'https://reportcontent.google.com/',
              },
              {
                name: 'StopNCII.org',
                desc: 'Bloqueio preventivo de mídia íntima não consentida',
                url: 'https://stopncii.org/',
              },
            ],
          },
          {
            id: 'reputation',
            label: 'Falsidade ideológica',
            steps: [
              {
                num: '01',
                title: 'Arquive as URLs falsas antes de denunciá-las',
                desc: 'Salve o link exato com registro de data antes de solicitar a derrubada da página ou perfil.',
              },
              {
                num: '02',
                title: 'Identifique o provedor do domínio falso',
                desc: 'Consulte a ICANN para exigir remoção por abuso ao registrador e bloqueie nos navegadores.',
              },
              {
                num: '03',
                title: 'Avise por voz sua família e assessores',
                desc: 'Impostores contatam seu círculo ao mesmo tempo pedindo transferências ou códigos urgentes.',
              },
              {
                num: '04',
                title: 'Esclareça pelo perfil oficial sem divulgar a fraude',
                desc: 'Publique nota breve na sua conta verificada sem inserir o link fraudulento.',
              },
            ],
            avoidLabel: 'O que evitar',
            avoidAction:
              'Não abra links suspeitos na sua rede doméstica ou celular; páginas-armadilha capturam seu IP real.',
            resources: [
              {
                name: 'ICANN Registration Lookup',
                desc: 'Identificação do provedor de um domínio falso',
                url: 'https://lookup.icann.org/',
              },
              {
                name: 'Google Safe Browsing',
                desc: 'Bloqueio de páginas fraudulentas nos navegadores',
                url: 'https://safebrowsing.google.com/safebrowsing/report_phish/',
              },
              {
                name: 'Wayback Machine Save',
                desc: 'Registro verificável antes da remoção de uma página',
                url: 'https://web.archive.org/save',
              },
              {
                name: 'Google Legal Removal',
                desc: 'Remoção legal por falsificação ou difamação',
                url: 'https://reportcontent.google.com/',
              },
            ],
          },
        ],
      },
      hygiene: {
        headline: 'Quatro regras permanentes de controle',
        subtitle: 'Medidas diretas que neutralizam a maioria dos ataques direcionados.',
        items: [
          {
            num: '01',
            title: 'Isole um e-mail exclusivo para bancos e patrimônio',
            desc: 'Nunca utilize seu endereço público para bancos, investimentos ou domínios principais.',
          },
          {
            num: '02',
            title: 'Elimine o SMS como fator de segurança',
            desc: 'Proteja contas críticas com chaves físicas de segurança ou aplicativos autenticadores.',
          },
          {
            num: '03',
            title: 'Delegue acessos sem compartilhar senhas',
            desc: 'Conceda permissões revogáveis à sua equipe por meio de cofres de custódia.',
          },
          {
            num: '04',
            title: 'Confirme por ligação qualquer urgência financeira',
            desc: 'Valide sempre por voz direta qualquer pedido incomum de valores ou documentos.',
          },
        ],
        auditCta: 'Proteger meu ambiente pessoal',
      },
    },
    admin: {
      dialogAria: 'Painel de processos Coto Privado',
      headerTitle: 'Processos · Coto Privado',
      exportCsv: 'Exportar CSV',
      signOut: 'Sair',
      closeAria: 'Fechar painel',
      verifying: 'Verificando credenciais...',
      signInTitle: 'Acesso Autorizado',
      signInDesc: 'Entre com sua conta @coto.lat para gerenciar os processos.',
      signInBtn: 'Entrar com Google',
      signInFailed: 'Não foi possível concluir a autenticação.',
      unauthorizedTitle: 'Conta não autorizada',
      unauthorizedPrefix: 'A sessão',
      unauthorizedMiddle: 'não possui permissão. Entre com uma conta',
      switchAccountBtn: 'Trocar conta',
      tabs: {
        all: (count) => `Todos (${count})`,
        pendiente: (count) => `Pendentes (${count})`,
        en_revision: (count) => `Em análise (${count})`,
        contactado: (count) => `Contatados (${count})`,
        cerrado: (count) => `Encerrados (${count})`,
      },
      statusLabels: {
        pendiente: 'Pendente',
        en_revision: 'Em análise',
        contactado: 'Contatado',
        cerrado: 'Encerrado',
      },
      searchPlaceholder: 'Filtrar por código, titular, perfil ou notas...',
      clearSearchAria: 'Limpar busca',
      serviceFilterAria: 'Filtrar por serviço',
      serviceAll: 'Todos os serviços',
      sortNewest: 'Mais recentes',
      sortOldest: 'Mais antigos',
      queueCount: (shown, total) =>
        shown === total
          ? `${total} ${total === 1 ? 'processo' : 'processos'}`
          : `${shown} de ${total} processos`,
      selectPrompt: 'Selecione um processo',
      openDossier: 'Abrir',
      backToList: (count) => `Voltar (${count})`,
      dossierPosition: (index, total) => `Processo ${index} de ${total}`,
      prevRequest: 'Anterior',
      nextRequest: 'Próximo',
      emptyFiltered: 'Nenhum processo corresponde aos filtros ativos.',
      clearFiltersBtn: 'Limpar filtros',
      serviceLabel: 'Serviço atribuído',
      modeLabel: 'Modalidade',
      dateLabel: 'Data',
      copyBtn: 'Copiar',
      copiedBtn: 'Copiado',
      openLinkBtn: 'Abrir link',
      deleteBtn: 'Excluir',
      unsavedNotes: 'Não salvo',
      hasNotesTag: 'Com notas',
      loadingDocs: 'Carregando processos...',
      emptyDocs: 'Nenhum processo registrado.',
      recentFallback: 'Recente',
      confirmDelete: 'Confirmar exclusão',
      cancelDelete: 'Cancelar',
      deleteAria: 'Excluir processo',
      modeAndTier: 'Modalidade e Serviço',
      soloShort: 'Pessoal',
      teamShort: 'Delegação',
      refLink: 'Perfil ou domínio',
      reportedConcern: 'Contexto do titular',
      noComments: 'Sem notas registradas.',
      dossierStatus: 'Status',
      closedLockedMsg: 'Processo encerrado.',
      reopenBtn: 'Reabrir',
      internalNotesLabel: 'Notas internas',
      internalNotesPlaceholder: 'Acordos, responsável ou próximos passos...',
      savingBtn: 'Salvando...',
      saveNotesBtn: 'Salvar notas',
      feedbackSyncError: 'Erro ao sincronizar processos.',
      feedbackStatusUpdated: (label) => `Status alterado para ${label}.`,
      feedbackStatusError: 'Não foi possível atualizar o status.',
      feedbackNotesSaved: 'Notas salvas.',
      feedbackNotesError: 'Não foi possível salvar as notas.',
      feedbackDeleteError: 'Não foi possível excluir o processo.',
    },
  },
};

const STORAGE_LANG_KEY = 'coto_privado_lang_v1';

function detectInitialLanguage(): Language {
  try {
    const saved = localStorage.getItem(STORAGE_LANG_KEY);
    if (saved === 'es' || saved === 'en' || saved === 'pt') {
      return saved;
    }
  } catch {
    // Ignore storage restrictions
  }

  if (typeof navigator !== 'undefined') {
    const prefs = navigator.languages?.length ? navigator.languages : [navigator.language];
    for (const raw of prefs) {
      const code = String(raw || '').toLowerCase();
      if (code.startsWith('es')) return 'es';
      if (code.startsWith('pt')) return 'pt';
      if (code.startsWith('en')) return 'en';
    }
  }

  return 'es';
}

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: TranslationDictionary;
}

const I18nContext = createContext<I18nContextValue>({
  lang: 'es',
  setLang: () => {},
  t: DICTIONARIES.es,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => detectInitialLanguage());

  const setLang = (next: Language) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_LANG_KEY, next);
    } catch {
      // Ignore private browsing errors
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t: DICTIONARIES[lang] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  return useContext(I18nContext);
}
