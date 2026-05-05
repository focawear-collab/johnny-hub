// FILE: app/app/technique/[id].tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Svg, { Circle, Ellipse, Path, G, Rect } from 'react-native-svg';
import { Colors, Typography, Spacing } from '@/constants/tokens';

// ---------------------------------------------------------------------------
// Step data per technique
// ---------------------------------------------------------------------------

interface TechStep {
  num: number;
  title: string;
  desc: string;
  tip: string;
}

interface TechniqueData {
  id: string;
  name: string;
  steps: TechStep[];
}

const TECHNIQUES_DATA: TechniqueData[] = [
  {
    id: '1',
    name: 'Estirado a mano',
    steps: [
      {
        num: 1,
        title: 'Saca la bola del frío',
        desc: 'Retira la bola de masa de la nevera 60–90 minutos antes. Debe estar a temperatura ambiente para que el gluten esté relajado y extensible.',
        tip: 'Si la masa está fría, resistirá el estirado y se rasgará. La paciencia aquí salva la pizza.',
      },
      {
        num: 2,
        title: 'Enharina la superficie',
        desc: 'Usa sémola fina o harina 00 en la mesa. La sémola es preferible porque no se absorbe y permite deslizar la pizza sobre la pala.',
        tip: 'Nunca uses demasiada harina: endurece la base y apaga el sabor.',
      },
      {
        num: 3,
        title: 'Aplana con la yema',
        desc: 'Con las yemas de los dedos, presiona desde el centro hacia fuera en círculos. Deja 2cm de cornicione intacto sin presionar.',
        tip: 'Las yemas protegen más que las palmas: ejercen presión puntual sin rasgar.',
      },
      {
        num: 4,
        title: 'Estira sobre los nudillos',
        desc: 'Levanta la masa sobre los nudillos cerrados y estira suavemente abriendo los brazos. La gravedad y el gluten hacen el trabajo.',
        tip: 'Nunca estires más de lo que el gluten permite. Si sientes resistencia, deja reposar 5 minutos.',
      },
      {
        num: 5,
        title: 'Redondea y comprueba',
        desc: 'La pizza debe tener 30–33cm de diámetro. Coloca sobre la pala enharinada y comprueba que desliza libremente antes de añadir salsa.',
        tip: 'El test de deslizamiento es crítico: si la pizza se pega a la pala, nunca llegará al horno limpiamente.',
      },
      {
        num: 6,
        title: 'Topping mínimo, lanzamiento rápido',
        desc: 'Añade salsa, queso y toppings rápido. Cada segundo sobre la pala humedece la base. Lanza en menos de 60 segundos.',
        tip: 'Menos es más en napoletana: 3 ingredientes máximo para que el horno trabaje limpio.',
      },
    ],
  },
  {
    id: '2',
    name: 'Slap & fold',
    steps: [
      {
        num: 1,
        title: 'Masa pegajosa al inicio',
        desc: 'El slap & fold funciona mejor con masas de alta hidratación (65%+). La masa debe estar pegajosa y sin amasar previo.',
        tip: 'Humedece las manos, no uses harina: el agua evita que la masa se pegue sin endurecer el gluten.',
      },
      {
        num: 2,
        title: 'Agarra por los extremos',
        desc: 'Estira la masa verticalmente con ambas manos. Déjala caer sobre la mesa (slap) para activar el gluten por impacto.',
        tip: 'El "slap" no es golpe: es dejada caer con control. El sonido es parte de la técnica.',
      },
      {
        num: 3,
        title: 'Pliega sobre sí misma',
        desc: 'Después del slap, dobla la parte superior sobre la inferior (fold). Rota 90° y repite.',
        tip: 'Cada ciclo = un slap + un fold. 50–100 ciclos para una masa básica de napoletana.',
      },
      {
        num: 4,
        title: 'La masa se transforma',
        desc: 'Observa cómo la masa pasa de pegajosa y extensible a lisa y con tensión. El gluten se está alineando.',
        tip: 'Si la masa sigue muy pegajosa a los 5 minutos, está subfermentada o muy fría.',
      },
      {
        num: 5,
        title: 'Windowpane test',
        desc: 'Estira un trozo entre dedos. Si forma una membrana traslúcida sin romperse, el gluten está desarrollado.',
        tip: 'El windowpane es el único test objetivo. No confíes en el tiempo, confía en la masa.',
      },
      {
        num: 6,
        title: 'Bola y reposo',
        desc: 'Forma una bola tensa, cubre con film y deja en reposo 30 minutos antes del bulk fermentation.',
        tip: 'El reposo post-amasado relaja el gluten y facilita el boleado final.',
      },
    ],
  },
  {
    id: '3',
    name: 'Fermentación fría',
    steps: [
      {
        num: 1,
        title: 'Por qué el frío',
        desc: 'A 4°C la levadura trabaja muy lentamente pero las bacterias lácticas y acéticas siguen activas. Se desarrollan ácidos que dan sabor complejo.',
        tip: 'La fermentación fría mejora también la digestibilidad: las enzimas degradan parte del gluten.',
      },
      {
        num: 2,
        title: 'Temperatura del frío',
        desc: 'La nevera doméstica oscila entre 2–6°C. Pon el termómetro en el estante donde guardas la masa. La variación afecta el resultado.',
        tip: 'La parte trasera de la nevera suele ser más fría. El cajón de verduras es el más estable.',
      },
      {
        num: 3,
        title: 'Tapers herméticos',
        desc: 'Cada bola en su taper hermético. El gas CO2 que produce la levadura llena el espacio y protege la masa de oxidación.',
        tip: 'Nunca uses plástico film sin recipiente: la masa se seca en los bordes y pierde extensibilidad.',
      },
      {
        num: 4,
        title: 'Ventana de uso: 24–96h',
        desc: 'A las 24h es joven con sabor suave. A las 48–72h el balance es perfecto. A las 96h es compleja y ácida.',
        tip: 'Más de 96h puede sobrefermentar si la levadura era excesiva. Reduce la levadura para fermentos largos.',
      },
      {
        num: 5,
        title: 'Atemperado obligatorio',
        desc: 'Saca la masa 60–90 minutos antes. Si la horneas fría, el interior no cocina bien y la base queda cruda.',
        tip: 'En verano con cocina a 28°C, 45–60 minutos bastan. En invierno puede necesitar 2 horas.',
      },
      {
        num: 6,
        title: 'Señales de punto óptimo',
        desc: 'La bola debe sentirse viva: ligera, aireada, con cierta tensión superficial y un leve olor láctico. Si huele a alcohol fuerte, está sobrefermentada.',
        tip: 'Una bola bien fermentada se estira casi sola. Si resiste agresivamente, necesita más atempero.',
      },
    ],
  },
  {
    id: '4',
    name: 'Boleado',
    steps: [
      {
        num: 1,
        title: 'Divide en porciones',
        desc: 'Usa balanza de cocina. Para napoletana: 250g. Para NY: 280g. Para detroit: 350g. La precisión garantiza pizzas uniformes.',
        tip: 'Divide toda la masa antes de bolear. Corta con rasqueta, nunca con tijeras.',
      },
      {
        num: 2,
        title: 'Pre-forma suelta',
        desc: 'Pliega los bordes hacia el centro una vez para crear algo de tensión. Déjala reposar 10 minutos (bench rest).',
        tip: 'El bench rest relaja el gluten y hace que el boleado final sea mucho más fácil.',
      },
      {
        num: 3,
        title: 'La técnica de la bola',
        desc: 'Con la palma de la mano sobre la masa, mueve en círculos pequeños y rápidos. La fricción con la mesa crea tensión superficial.',
        tip: 'La presión justa: no tan fuerte que aplaste, no tan suave que no haya fricción.',
      },
      {
        num: 4,
        title: 'Tensión superficial',
        desc: 'El resultado correcto: una bola perfectamente redonda, con la superficie tensa como un tambor y el cierre (sello) hacia abajo.',
        tip: 'Si ves arrugas en la superficie, la tensión es insuficiente. Repite el movimiento circular.',
      },
      {
        num: 5,
        title: 'Sella la bola',
        desc: 'Pellizca el cierre inferior para que no se abra durante la fermentación. El cierre siempre va hacia abajo en el taper.',
        tip: 'Un cierre mal sellado se abre en el frío y la bola pierde su forma característica.',
      },
      {
        num: 6,
        title: 'Al taper con aceite',
        desc: 'Pinta el taper con unas gotas de aceite de oliva. Deposita la bola con el cierre hacia abajo y cierra herméticamente.',
        tip: 'El aceite evita que la bola se pegue sin alterar la hidratación de la masa.',
      },
    ],
  },
  {
    id: '5',
    name: 'Horneado en piedra',
    steps: [
      {
        num: 1,
        title: 'La física del horneado',
        desc: 'La piedra de cordierita almacena calor y lo transfiere a la base de la pizza en segundos. Sin piedra, la masa burbujea antes de cocinar bien la base.',
        tip: 'Una piedra de 3cm de grosor necesita más tiempo pero da mejor resultado que una fina.',
      },
      {
        num: 2,
        title: 'Precalentamiento: mínimo 45 min',
        desc: 'Pon el horno a máximo (250–300°C) con la piedra dentro desde el inicio. La piedra necesita 45–60 minutos para saturarse de calor.',
        tip: 'El termómetro de infrarrojos es tu mejor aliado: la piedra debe marcar 280–300°C mínimo.',
      },
      {
        num: 3,
        title: 'Posición de la piedra',
        desc: 'Coloca la piedra en el tercio superior del horno. El calor del grill dorar el cornicione mientras la base se cocina por conducción.',
        tip: 'En hornos caseros, activa el grill (broiler) los últimos 2 minutos para simular el techo del horno de leña.',
      },
      {
        num: 4,
        title: 'Pala de lanzamiento',
        desc: 'Ensaya el movimiento de lanzar sin pizza: la pala entra en ángulo de 30°, se posiciona sobre la piedra y retiras hacia ti con movimiento rápido.',
        tip: 'Un movimiento de lanzamiento inseguro deposita la pizza doblada. Practica con una tortilla de harina.',
      },
      {
        num: 5,
        title: 'Los primeros 60 segundos',
        desc: 'No abras el horno. El vapor inicial que genera la masa es clave para que la base no quede dura. Transcurridos 60s puedes revisar.',
        tip: 'La leopardatura (manchas negras en el cornicione) es señal de temperatura correcta, no de quemado.',
      },
      {
        num: 6,
        title: 'Extracción y reposo',
        desc: 'Usa la pala para sacar la pizza. Deja reposar 60 segundos sobre rejilla antes de cortar: los jugos se redistribuyen.',
        tip: 'Cortar en caliente inmediato expulsa todos los jugos. 60 segundos de reposo cambia la textura del mordisco.',
      },
    ],
  },
  {
    id: '6',
    name: 'Salsa napolitana',
    steps: [
      {
        num: 1,
        title: 'Tomates San Marzano DOP',
        desc: 'Solo San Marzano DOP pelados. La acidez, dulzor y contenido de agua son distintos a cualquier otro tomate. No hay sustituto directo.',
        tip: 'Si no encuentras San Marzano DOP, usa tomates italianos pelados en lata de calidad, nunca triturado industrial.',
      },
      {
        num: 2,
        title: 'Sin cocción',
        desc: 'La salsa napoletana es cruda. El horno cocinará la salsa sobre la pizza. Cocinarla antes doble-cocina los azúcares y pierde frescura.',
        tip: 'La única excepción es la marinara (ajo y orégano) donde se puede calentar brevemente el aceite con el ajo.',
      },
      {
        num: 3,
        title: 'Triturado con las manos',
        desc: 'Aplasta los tomates pelados con las manos. El triturado manual rompe de forma irregular, creando una textura más auténtica que la batidora.',
        tip: 'La batidora incorpora aire y emulsiona en exceso. Las manos respetan la textura heterogénea.',
      },
      {
        num: 4,
        title: 'Solo sal',
        desc: 'Sal marina fina al gusto. Nada más. Sin azúcar, sin hierbas, sin ajo en la salsa base. La pureza es la firma napolitana.',
        tip: 'El orégano y la albahaca van encima de la pizza, no dentro de la salsa.',
      },
      {
        num: 5,
        title: 'Cantidad exacta',
        desc: 'Para una pizza de 250g: 60–80g de salsa. Colócala con cuchara desde el centro en espiral. Deja 2cm de borde sin salsa.',
        tip: 'Exceso de salsa = base mojada. La proporción correcta es la que se seca en los bordes al hornearse.',
      },
      {
        num: 6,
        title: 'Temperatura y uso',
        desc: 'La salsa debe estar a temperatura ambiente cuando va a la pizza. Si está fría del frigorífico, baja la temperatura de la masa y alarga el tiempo de horneado.',
        tip: 'Prepara la salsa el día anterior y guarda en frigorífico: los sabores se integran mejor con 12 horas de reposo.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Dough morphing SVG illustration
// ---------------------------------------------------------------------------

function DoughSVG({ step }: { step: number }) {
  // step 0–5, morphs from ball to disc
  const progress = step / 5; // 0 = ball, 1 = disc
  const rx = 16 + progress * 44; // 16 → 60
  const ry = 16 - progress * 4;  // 16 → 12 (slight flatten)

  return (
    <Svg width={200} height={120} viewBox="0 0 200 120">
      {/* Base surface */}
      <Rect x={20} y={90} width={160} height={6} rx={3} fill={Colors.bg3} />

      {/* Dough shape */}
      <Ellipse
        cx={100}
        cy={70}
        rx={rx}
        ry={ry + 10}
        fill={Colors.bg3}
        stroke={Colors.fg2}
        strokeWidth={1.5}
      />

      {/* Texture lines */}
      {progress < 0.5 && (
        <Circle cx={100} cy={70} r={8} fill={Colors.fg3} opacity={0.4} />
      )}
      {progress >= 0.5 && (
        <>
          <Ellipse cx={100} cy={70} rx={rx - 8} ry={ry + 2} fill="none" stroke={Colors.fg3} strokeWidth={0.8} opacity={0.3} />
          <Ellipse cx={100} cy={70} rx={rx - 20} ry={ry - 2} fill="none" stroke={Colors.fg3} strokeWidth={0.8} opacity={0.2} />
        </>
      )}

      {/* Step indicator arrows */}
      {step > 0 && step < 5 && (
        <>
          <Path
            d={`M${100 - rx - 10} 70 L${100 - rx - 20} 70`}
            stroke={Colors.accent}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
          <Path
            d={`M${100 + rx + 10} 70 L${100 + rx + 20} 70`}
            stroke={Colors.accent}
            strokeWidth={1.5}
            strokeLinecap="round"
          />
        </>
      )}

      {/* Step number glyph */}
      <Circle cx={100} cy={26} r={14} fill={Colors.accentSoft} stroke={Colors.accent} strokeWidth={1} />
    </Svg>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function TechniqueDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const technique = TECHNIQUES_DATA.find((t) => t.id === id) ?? TECHNIQUES_DATA[0];
  const [currentStep, setCurrentStep] = useState(0);
  const step = technique.steps[currentStep];

  const goNext = () => {
    if (currentStep < technique.steps.length - 1) setCurrentStep(currentStep + 1);
  };
  const goPrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <View style={styles.root}>
      {/* Back button */}
      <Pressable style={styles.backBtn} onPress={() => router.back()}>
        <Svg width={24} height={24} viewBox="0 0 24 24">
          <Path
            d="M19 12H5M12 5l-7 7 7 7"
            stroke={Colors.fg0}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </Pressable>

      {/* Progress dots */}
      <View style={styles.dotsRow}>
        {technique.steps.map((_, i) => (
          <Pressable key={i} onPress={() => setCurrentStep(i)}>
            <View
              style={[
                styles.dot,
                i === currentStep && styles.dotActive,
                i < currentStep && styles.dotPast,
              ]}
            />
          </Pressable>
        ))}
      </View>

      {/* Technique name */}
      <Text style={styles.techName}>{technique.name}</Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* SVG illustration */}
        <View style={styles.illustrationWrap}>
          <DoughSVG step={currentStep} />
        </View>

        {/* Step number + title */}
        <View style={styles.stepHeader}>
          <View style={styles.stepNumBadge}>
            <Text style={styles.stepNumText}>{step.num}</Text>
          </View>
          <Text style={styles.stepTitle}>{step.title}</Text>
        </View>

        {/* Description */}
        <Text style={styles.stepDesc}>{step.desc}</Text>

        {/* Tip box */}
        <View style={styles.tipBox}>
          <View style={styles.tipAccentBar} />
          <View style={styles.tipContent}>
            <Text style={styles.tipLabel}>CONSEJO</Text>
            <Text style={styles.tipText}>{step.tip}</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Navigation buttons */}
      <View style={styles.navBar}>
        <Pressable
          style={[styles.navBtn, currentStep === 0 && styles.navBtnDisabled]}
          onPress={goPrev}
          disabled={currentStep === 0}
        >
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path
              d="M19 12H5M12 5l-7 7 7 7"
              stroke={currentStep === 0 ? Colors.fg3 : Colors.fg0}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
          <Text style={[styles.navBtnText, currentStep === 0 && styles.navBtnTextDisabled]}>
            Anterior
          </Text>
        </Pressable>

        <Text style={styles.stepCounter}>
          {currentStep + 1} / {technique.steps.length}
        </Text>

        <Pressable
          style={[
            styles.navBtn,
            styles.navBtnNext,
            currentStep === technique.steps.length - 1 && styles.navBtnDisabled,
          ]}
          onPress={goNext}
          disabled={currentStep === technique.steps.length - 1}
        >
          <Text style={[styles.navBtnText, currentStep === technique.steps.length - 1 && styles.navBtnTextDisabled]}>
            {currentStep === technique.steps.length - 1 ? 'Completado' : 'Siguiente'}
          </Text>
          <Svg width={20} height={20} viewBox="0 0 24 24">
            <Path
              d="M5 12h14M12 5l7 7-7 7"
              stroke={currentStep === technique.steps.length - 1 ? Colors.fg3 : Colors.accent}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </Svg>
        </Pressable>
      </View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bg0,
  },
  backBtn: {
    position: 'absolute',
    top: 52,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.bg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 60,
    paddingBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.bg3,
    borderWidth: 1,
    borderColor: Colors.line2,
  },
  dotActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
    width: 24,
    borderRadius: 4,
  },
  dotPast: {
    backgroundColor: Colors.fg3,
    borderColor: Colors.fg3,
  },
  techName: {
    fontFamily: Typography.fontFamily.serif,
    fontSize: Typography.size.xl,
    color: Colors.fg1,
    textAlign: 'center',
    paddingBottom: 10,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPadding,
  },
  illustrationWrap: {
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: Colors.bg1,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.line,
    overflow: 'hidden',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 14,
  },
  stepNumBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.accentSoft,
    borderWidth: 1,
    borderColor: Colors.accent + '44',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  stepNumText: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.base,
    color: Colors.accent,
  },
  stepTitle: {
    fontFamily: Typography.fontFamily.sansSemi,
    fontSize: Typography.size.lg,
    color: Colors.fg0,
    flex: 1,
  },
  stepDesc: {
    fontFamily: Typography.fontFamily.sans,
    fontSize: Typography.size.md,
    color: Colors.fg1,
    lineHeight: 24,
    marginBottom: 20,
  },
  tipBox: {
    flexDirection: 'row',
    backgroundColor: Colors.goldSoft,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.gold + '33',
    overflow: 'hidden',
  },
  tipAccentBar: {
    width: 3,
    backgroundColor: Colors.gold,
  },
  tipContent: {
    flex: 1,
    padding: 14,
  },
  tipLabel: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.xs,
    color: Colors.gold,
    letterSpacing: Typography.letterSpacing.caps,
    marginBottom: 6,
  },
  tipText: {
    fontFamily: Typography.fontFamily.serifItalic,
    fontSize: Typography.size.base,
    color: Colors.fg0,
    lineHeight: 22,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPadding,
    paddingVertical: 16,
    paddingBottom: 34,
    backgroundColor: Colors.bg0,
    borderTopWidth: 1,
    borderTopColor: Colors.line,
  },
  navBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: Colors.bg2,
    borderWidth: 1,
    borderColor: Colors.line2,
  },
  navBtnNext: {
    backgroundColor: Colors.accentSoft,
    borderColor: Colors.accent + '44',
  },
  navBtnDisabled: {
    opacity: 0.35,
  },
  navBtnText: {
    fontFamily: Typography.fontFamily.sansMedium,
    fontSize: Typography.size.sm,
    color: Colors.fg0,
  },
  navBtnTextDisabled: {
    color: Colors.fg3,
  },
  stepCounter: {
    fontFamily: Typography.fontFamily.mono,
    fontSize: Typography.size.sm,
    color: Colors.fg2,
  },
});
