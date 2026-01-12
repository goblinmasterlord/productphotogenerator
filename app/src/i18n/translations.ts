export type Language = 'hu' | 'en';

export interface Translations {
  // Top Bar
  topBar: {
    steps: {
      upload: string;
      flow: string;
      configure: string;
      results: string;
    };
    resources: string;
    resourceLinks: {
      promptingGuide: string;
      adCreatives: string;
    };
    backToHome: string;
  };

  // Step Upload
  stepUpload: {
    title: string;
    subtitle: string;
    dropzone: {
      title: string;
      subtitle: string;
      formats: string;
      previewHint: string;
    };
    tips: {
      title: string;
      highQuality: string;
      centered: string;
      lighting: string;
      background: string;
    };
    continue: string;
  };

  // Step Flow Select
  stepFlowSelect: {
    title: string;
    subtitle: string;
    flows: {
      grid: {
        title: string;
        description: string;
      };
      individual: {
        title: string;
        description: string;
      };
      custom: {
        title: string;
        description: string;
      };
      macroSet: {
        title: string;
        description: string;
      };
    };
    settings: {
      ratio: string;
      resolution: string;
      variations: string;
    };
    back: string;
    continue: string;
  };

  // Step Concept Select
  stepConceptSelect: {
    title: string;
    subtitle: string;
    concepts: {
      heroStillLife: {
        name: string;
        description: string;
      };
      macroDetail: {
        name: string;
        description: string;
      };
      dynamicInteraction: {
        name: string;
        description: string;
      };
      sculpturalMinimal: {
        name: string;
        description: string;
      };
      floatingElements: {
        name: string;
        description: string;
      };
      sensoryCloseup: {
        name: string;
        description: string;
      };
      colorConcept: {
        name: string;
        description: string;
      };
      abstractEssence: {
        name: string;
        description: string;
      };
      surrealFusion: {
        name: string;
        description: string;
      };
    };
    selectedCount: {
      single: string;
      plural: string;
    };
    back: string;
    generate: string;
  };

  // Step Custom Prompt
  stepCustomPrompt: {
    title: string;
    subtitle: string;
    placeholder: string;
    optimizeBtn: string;
    optimizedLabel: string;
    useThis: string;
    dismiss: string;
    back: string;
    generate: string;
  };

  // Step Results
  stepResults: {
    title: {
      generating: string;
      done: string;
    };
    progress: {
      images: string;
      generating: string;
    };
    errorTitle: string;
    errorSubtitle: string;
    warningPrefix: string;
    generated: {
      single: string;
      plural: string;
    };
    cost: {
      estimated: string;
      image: string;
      images: string;
    };
    actions: {
      generateMore: string;
      downloadAll: string;
      startOver: string;
      goBack: string;
    };
    generatingStatus: string;
  };

  // Common
  common: {
    errors: {
      uploadImageFile: string;
      optimizeFailed: string;
    };
  };
}

export const translations: Record<Language, Translations> = {
  hu: {
    topBar: {
      steps: {
        upload: 'Feltöltés',
        flow: 'Stílus választás',
        configure: 'Beállítás',
        results: 'Eredmények',
      },
      resources: 'Segédanyagok',
      resourceLinks: {
        promptingGuide: 'BanánMester Útmutató',
        adCreatives: 'Reklámkreatív generálás',
      },
      backToHome: 'Vissza a kezdőlapra',
    },

    stepUpload: {
      title: 'Töltsd fel a terméked',
      subtitle: 'Kezdésnek válassz egy szép, minőségi képet a termékedről',
      dropzone: {
        title: 'Húzd ide a terméked képét',
        subtitle: 'vagy kattints a tallózáshoz',
        formats: 'JPG, PNG, WebP támogatott',
        previewHint: 'Kattints az X-re másik kép feltöltéséhez',
      },
      tips: {
        title: 'Tippek a legjobb eredményhez',
        highQuality: 'Nagy felbontású, éles kép',
        centered: 'Termék középen, jól látható',
        lighting: 'Egyenletes, lágy megvilágítás',
        background: 'Tiszta, egyszínű háttér',
      },
      continue: 'Tovább',
    },

    stepFlowSelect: {
      title: 'Válassz generálási módot',
      subtitle: 'Állítsd be a generálás paramétereit',
      flows: {
        grid: {
          title: 'Teljes rács',
          description: 'Mind a 9 koncepció 3×3-as rácsban',
        },
        individual: {
          title: 'Válogatás',
          description: 'Válaszd ki, melyik koncepciókat generálja',
        },
        custom: {
          title: 'Saját prompt',
          description: 'Írd meg a saját instrukciód',
        },
        macroSet: {
          title: 'Makró szett',
          description: '4 különböző közeli felvétel a termékről',
        },
      },
      settings: {
        ratio: 'Arány',
        resolution: 'Felbontás',
        variations: 'Variációk',
      },
      back: 'Vissza',
      continue: 'Tovább',
    },

    stepConceptSelect: {
      title: 'Válassz koncepciókat',
      subtitle: 'Jelöld ki, milyen kreatív koncepciókat generáljon a termékedből',
      concepts: {
        heroStillLife: {
          name: 'Hősképes csendélet',
          description: 'Merész, ikonikus kompozíció erős vizuális hatással',
        },
        macroDetail: {
          name: 'Makró részlet',
          description: 'Extrém közeli, kiemelve a textúrát és anyagot',
        },
        dynamicInteraction: {
          name: 'Dinamikus interakció',
          description: 'Folyadék vagy részecske effektek a termék körül',
        },
        sculpturalMinimal: {
          name: 'Szobor minimalista',
          description: 'Tiszta elrendezés absztrakt geometriai formákkal',
        },
        floatingElements: {
          name: 'Lebegő elemek',
          description: 'Súlytalan kompozíció, innováció érzete',
        },
        sensoryCloseup: {
          name: 'Érzéki közelkép',
          description: 'Tapintható realizmus, hangsúlyos haptika',
        },
        colorConcept: {
          name: 'Színkoncepció',
          description: 'Jelenet a termék színpalettájával vezérelve',
        },
        abstractEssence: {
          name: 'Absztrakt esszencia',
          description: 'Szimbolikus összetevő vagy komponens vizualizáció',
        },
        surrealFusion: {
          name: 'Szürrealista fúzió',
          description: 'Elegáns ötvözet realizmusból és fantáziából',
        },
      },
      selectedCount: {
        single: 'koncepció kijelölve',
        plural: 'koncepció kijelölve',
      },
      back: 'Vissza',
      generate: 'Generálás',
    },

    stepCustomPrompt: {
      title: 'Egyedi prompt',
      subtitle: 'Fogalmazd meg a saját instrukciód, vagy használj AI-optimalizálást',
      placeholder: 'Írd le, milyen kreatívot szeretnél...\n\nPéldául: Luxus termékfotó puha fénnyel, rózsaszirmok ágyán lebegve, hajnali harmatcseppekkel díszítve...',
      optimizeBtn: 'Optimalizálás AI-val',
      optimizedLabel: 'Optimalizált prompt',
      useThis: 'Ezt használom',
      dismiss: 'Elvetem',
      back: 'Vissza',
      generate: 'Generálás',
    },

    stepResults: {
      title: {
        generating: 'Készülnek a kreatívok',
        done: 'Itt vannak a kreatívok',
      },
      progress: {
        images: 'kép',
        generating: 'Generálás',
      },
      errorTitle: 'Valami hiba történt',
      errorSubtitle: 'Nem sikerült legenerálni a képeket',
      warningPrefix: 'Néhány kép generálása sikertelen:',
      generated: {
        single: 'kép generálva',
        plural: 'kép generálva',
      },
      cost: {
        estimated: 'Becsült költség',
        image: 'kép',
        images: 'kép',
      },
      actions: {
        generateMore: 'Több generálása',
        downloadAll: 'Összes letöltése',
        startOver: 'Újrakezdem',
        goBack: 'Vissza',
      },
      generatingStatus: 'Generálás folyamatban...',
    },

    common: {
      errors: {
        uploadImageFile: 'Kérlek, tölts fel egy képfájlt',
        optimizeFailed: 'A prompt optimalizálása sikertelen. Kérlek, próbáld újra.',
      },
    },
  },

  en: {
    topBar: {
      steps: {
        upload: 'Upload',
        flow: 'Choose Flow',
        configure: 'Configure',
        results: 'Results',
      },
      resources: 'Resources',
      resourceLinks: {
        promptingGuide: 'BanánMester Prompting Guide',
        adCreatives: 'Generate Ad Creatives',
      },
      backToHome: 'Back to Home',
    },

    stepUpload: {
      title: 'Upload Your Product',
      subtitle: 'Start by uploading a high-quality image of your product',
      dropzone: {
        title: 'Drop your product image here',
        subtitle: 'or click to browse',
        formats: 'Supports JPG, PNG, WebP',
        previewHint: 'Click the X to upload a different image',
      },
      tips: {
        title: 'Tips for best results',
        highQuality: 'High resolution, sharp image',
        centered: 'Product centered and visible',
        lighting: 'Even, soft lighting',
        background: 'Clean, solid background',
      },
      continue: 'Continue',
    },

    stepFlowSelect: {
      title: 'Choose Your Flow',
      subtitle: 'Select generation mode and configure settings',
      flows: {
        grid: {
          title: 'Full Grid',
          description: 'Generate all 9 concepts in a 3×3 grid',
        },
        individual: {
          title: 'Pick & Choose',
          description: 'Select specific concepts to generate',
        },
        custom: {
          title: 'Custom Prompt',
          description: 'Write your own prompt',
        },
        macroSet: {
          title: 'Macro Set',
          description: '4 different close-up shots of your product',
        },
      },
      settings: {
        ratio: 'Ratio',
        resolution: 'Resolution',
        variations: 'Variations',
      },
      back: 'Back',
      continue: 'Continue',
    },

    stepConceptSelect: {
      title: 'Select Concepts',
      subtitle: 'Choose which creative concepts to generate for your product',
      concepts: {
        heroStillLife: {
          name: 'Hero Still Life',
          description: 'Bold, iconic composition with striking visual impact',
        },
        macroDetail: {
          name: 'Macro Detail',
          description: 'Extreme close-up highlighting texture and material',
        },
        dynamicInteraction: {
          name: 'Dynamic Interaction',
          description: 'Liquid or particle effects surrounding the product',
        },
        sculpturalMinimal: {
          name: 'Sculptural Minimal',
          description: 'Clean arrangement with abstract geometric forms',
        },
        floatingElements: {
          name: 'Floating Elements',
          description: 'Weightless composition suggesting innovation',
        },
        sensoryCloseup: {
          name: 'Sensory Close-up',
          description: 'Tactile realism emphasizing touch and feel',
        },
        colorConcept: {
          name: 'Color Concept',
          description: 'Scene driven by the product color palette',
        },
        abstractEssence: {
          name: 'Abstract Essence',
          description: 'Symbolic ingredient or component visualization',
        },
        surrealFusion: {
          name: 'Surreal Fusion',
          description: 'Elegant blend of realism and imagination',
        },
      },
      selectedCount: {
        single: 'concept selected',
        plural: 'concepts selected',
      },
      back: 'Back',
      generate: 'Generate',
    },

    stepCustomPrompt: {
      title: 'Custom Prompt',
      subtitle: 'Write your own prompt or use AI to optimize it',
      placeholder: 'Describe the creative you want to generate...\n\nExample: Create a luxurious product shot with soft lighting, floating on a bed of rose petals with morning dew droplets...',
      optimizeBtn: 'Optimize with AI',
      optimizedLabel: 'Optimized Prompt',
      useThis: 'Use This',
      dismiss: 'Dismiss',
      back: 'Back',
      generate: 'Generate Image',
    },

    stepResults: {
      title: {
        generating: 'Creating Your Creatives',
        done: 'Your Creatives',
      },
      progress: {
        images: 'images',
        generating: 'Generating',
      },
      errorTitle: 'Something went wrong',
      errorSubtitle: "We couldn't generate your images",
      warningPrefix: 'Some images failed to generate:',
      generated: {
        single: 'image generated',
        plural: 'images generated',
      },
      cost: {
        estimated: 'Est. cost',
        image: 'image',
        images: 'images',
      },
      actions: {
        generateMore: 'Generate More',
        downloadAll: 'Download All',
        startOver: 'Start Over',
        goBack: 'Go Back',
      },
      generatingStatus: 'Generating...',
    },

    common: {
      errors: {
        uploadImageFile: 'Please upload an image file',
        optimizeFailed: 'Failed to optimize prompt. Please try again.',
      },
    },
  },
};
