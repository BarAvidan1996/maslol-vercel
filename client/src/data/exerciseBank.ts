export interface Exercise {
  id: string;
  name: string;
  description: string;
  type: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  repetitions?: number;
  sets?: number;
  videoUrl?: string;
  imageUrl?: string;
  instructions?: string;
  requiredEquipment?: Equipment[];
  status: 'pending' | 'completed';
  isCompleted: boolean;
}

interface Equipment {
  id: string;
  name: string;
  description: string;
  category: string;
}

export const exerciseBank: Exercise[] = [
  {
    id: 'squat',
    name: 'סקוואט',
    description: 'תרגיל לחיזוק שרירי הרגליים והישבן',
    type: 'strength',
    category: 'רגליים',
    difficulty: 'intermediate',
    duration: 10,
    repetitions: 12,
    sets: 3,
    instructions: 'עמוד עם רגליים ברוחב הכתפיים, כופף ברכיים והורד את הישבן כלפי מטה, שמור על גב ישר',
    requiredEquipment: [],
    status: 'pending',
    isCompleted: false
  },
  {
    id: 'lunge',
    name: 'לאנג\'',
    description: 'תרגיל לשיפור שיווי משקל וחיזוק שרירי הרגליים',
    type: 'strength',
    category: 'רגליים',
    difficulty: 'intermediate',
    duration: 8,
    repetitions: 10,
    sets: 3,
    instructions: 'צעד קדימה עם רגל אחת, כופף את הברך עד 90 מעלות, החזר את הרגל למקום',
    requiredEquipment: [],
    status: 'pending',
    isCompleted: false
  },
  {
    id: 'shoulder-press',
    name: 'לחיצת כתפיים',
    description: 'תרגיל לחיזוק שרירי הכתפיים והזרועות',
    type: 'strength',
    category: 'פלג גוף עליון',
    difficulty: 'beginner',
    duration: 12,
    repetitions: 15,
    sets: 3,
    instructions: 'החזק משקולות בגובה הכתפיים, דחוף כלפי מעלה עד ליישור מלא של הזרועות',
    requiredEquipment: [
      {
        id: 'dumbbells',
        name: 'משקולות',
        description: 'משקולות יד',
        category: 'ציוד כוח'
      }
    ],
    status: 'pending',
    isCompleted: false
  },
  {
    id: 'plank',
    name: 'פלאנק',
    description: 'תרגיל לחיזוק שרירי הליבה והבטן',
    type: 'core',
    category: 'ליבה',
    difficulty: 'advanced',
    duration: 5,
    repetitions: 3,
    sets: 1,
    instructions: 'שכב על הבטן, הרם את הגוף על האמות והאצבעות, שמור על גוף ישר',
    requiredEquipment: [],
    status: 'pending',
    isCompleted: false
  },
  {
    id: 'bicep-curl',
    name: 'כפיפת מרפקים',
    description: 'תרגיל לחיזוק שרירי הזרוע',
    type: 'strength',
    category: 'פלג גוף עליון',
    difficulty: 'beginner',
    duration: 10,
    repetitions: 12,
    sets: 3,
    instructions: 'החזק משקולות עם כפות ידיים כלפי מעלה, כופף מרפקים והבא את המשקולות לכתפיים',
    requiredEquipment: [
      {
        id: 'dumbbells',
        name: 'משקולות',
        description: 'משקולות יד',
        category: 'ציוד כוח'
      }
    ],
    status: 'pending',
    isCompleted: false
  },
  {
    id: 'bridge',
    name: 'גשר אגן',
    description: 'תרגיל לחיזוק שרירי הישבן והגב התחתון',
    type: 'strength',
    category: 'גב',
    difficulty: 'beginner',
    duration: 8,
    repetitions: 15,
    sets: 3,
    instructions: 'שכב על הגב, כופף ברכיים, הרם את האגן כלפי מעלה',
    requiredEquipment: [
      {
        id: 'mat',
        name: 'מזרן',
        description: 'מזרן אימון',
        category: 'ציוד בסיסי'
      }
    ],
    status: 'pending',
    isCompleted: false
  },
  {
    id: 'wall-pushup',
    name: 'שכיבות סמיכה על קיר',
    description: 'תרגיל לחיזוק שרירי החזה והכתפיים',
    type: 'strength',
    category: 'פלג גוף עליון',
    difficulty: 'beginner',
    duration: 10,
    repetitions: 12,
    sets: 3,
    instructions: 'עמוד מול קיר, הנח ידיים על הקיר בגובה הכתפיים, כופף מרפקים והתקרב לקיר',
    requiredEquipment: [],
    status: 'pending',
    isCompleted: false
  }
];
