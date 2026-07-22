// Dữ liệu Bảng Chữ Cái (Pinyin): Phụ âm - Nguyên âm - Thanh điệu
// Mỗi mục gắn với 1 chữ Hán ví dụ để học trực quan

const ALPHABET_DATA = {

  initials: [ // Phụ âm đầu - 21 âm
    { pinyin: "b",  example: "bà",   hanzi: "爸", meaning: "bố, cha" },
    { pinyin: "p",  example: "pó",   hanzi: "婆", meaning: "bà (nội/ngoại)" },
    { pinyin: "m",  example: "mā",   hanzi: "妈", meaning: "mẹ" },
    { pinyin: "f",  example: "fēi",  hanzi: "飞", meaning: "bay" },
    { pinyin: "d",  example: "dà",   hanzi: "大", meaning: "to, lớn" },
    { pinyin: "t",  example: "tiān", hanzi: "天", meaning: "trời" },
    { pinyin: "n",  example: "nǐ",   hanzi: "你", meaning: "bạn" },
    { pinyin: "l",  example: "lái",  hanzi: "来", meaning: "đến" },
    { pinyin: "g",  example: "gǒu",  hanzi: "狗", meaning: "con chó" },
    { pinyin: "k",  example: "kàn",  hanzi: "看", meaning: "nhìn, xem" },
    { pinyin: "h",  example: "hǎo",  hanzi: "好", meaning: "tốt, ổn" },
    { pinyin: "j",  example: "jiā",  hanzi: "家", meaning: "nhà" },
    { pinyin: "q",  example: "qī",   hanzi: "七", meaning: "số bảy" },
    { pinyin: "x",  example: "xiè",  hanzi: "谢", meaning: "cảm ơn" },
    { pinyin: "zh", example: "zhōng",hanzi: "中", meaning: "giữa, Trung(Quốc)" },
    { pinyin: "ch", example: "chī",  hanzi: "吃", meaning: "ăn" },
    { pinyin: "sh", example: "shì",  hanzi: "是", meaning: "là" },
    { pinyin: "r",  example: "rén",  hanzi: "人", meaning: "người" },
    { pinyin: "z",  example: "zài",  hanzi: "再", meaning: "lại, nữa" },
    { pinyin: "c",  example: "cāi",  hanzi: "猜", meaning: "đoán" },
    { pinyin: "s",  example: "sān",  hanzi: "三", meaning: "số ba" },
  ],

  finals: [ // Nguyên âm / vần
    { pinyin: "a",    example: "mā",   hanzi: "妈", meaning: "mẹ" },
    { pinyin: "o",    example: "wǒ",   hanzi: "我", meaning: "tôi" },
    { pinyin: "e",    example: "è",    hanzi: "饿", meaning: "đói" },
    { pinyin: "i",    example: "yī",   hanzi: "一", meaning: "số một" },
    { pinyin: "u",    example: "wǔ",   hanzi: "五", meaning: "số năm" },
    { pinyin: "ü",    example: "lǜ",   hanzi: "绿", meaning: "màu xanh lá" },
    { pinyin: "ai",   example: "ài",   hanzi: "爱", meaning: "yêu" },
    { pinyin: "ei",   example: "hēi",  hanzi: "黑", meaning: "màu đen" },
    { pinyin: "ao",   example: "hǎo",  hanzi: "好", meaning: "tốt" },
    { pinyin: "ou",   example: "zǒu",  hanzi: "走", meaning: "đi bộ" },
    { pinyin: "an",   example: "ān",   hanzi: "安", meaning: "an toàn" },
    { pinyin: "en",   example: "hěn",  hanzi: "很", meaning: "rất" },
    { pinyin: "ang",  example: "máng", hanzi: "忙", meaning: "bận" },
    { pinyin: "eng",  example: "dēng", hanzi: "灯", meaning: "đèn" },
    { pinyin: "ong",  example: "lóng", hanzi: "龙", meaning: "rồng" },
    { pinyin: "ia",   example: "jiā",  hanzi: "家", meaning: "nhà" },
    { pinyin: "ie",   example: "jiě",  hanzi: "姐", meaning: "chị gái" },
    { pinyin: "iao",  example: "xiǎo", hanzi: "小", meaning: "nhỏ" },
    { pinyin: "iu",   example: "liù",  hanzi: "六", meaning: "số sáu" },
    { pinyin: "ian",  example: "tiān", hanzi: "天", meaning: "trời" },
    { pinyin: "iang", example: "xiǎng",hanzi: "想", meaning: "nghĩ, muốn" },
    { pinyin: "ua",   example: "huā",  hanzi: "花", meaning: "hoa" },
    { pinyin: "uo",   example: "shuō", hanzi: "说", meaning: "nói" },
    { pinyin: "uai",  example: "kuài", hanzi: "快", meaning: "nhanh" },
    { pinyin: "ui",   example: "duì",  hanzi: "对", meaning: "đúng" },
    { pinyin: "uan",  example: "wàn",  hanzi: "万", meaning: "vạn (10.000)" },
    { pinyin: "uang", example: "guāng",hanzi: "光", meaning: "ánh sáng" },
    { pinyin: "üe",   example: "xué",  hanzi: "学", meaning: "học" },
  ],

  tones: [ // Thanh điệu - dùng chung âm "ma" để dễ so sánh
    { pinyin: "mā", toneLabel: "Thanh 1 · ngang",       hanzi: "妈", meaning: "mẹ" },
    { pinyin: "má", toneLabel: "Thanh 2 · sắc, đi lên",  hanzi: "麻", meaning: "cây gai, vừng" },
    { pinyin: "mǎ", toneLabel: "Thanh 3 · xuống rồi lên",hanzi: "马", meaning: "con ngựa" },
    { pinyin: "mà", toneLabel: "Thanh 4 · xuống mạnh",   hanzi: "骂", meaning: "mắng, chửi" },
    { pinyin: "ma", toneLabel: "Thanh nhẹ · không dấu",  hanzi: "吗", meaning: "từ nghi vấn (à? hả?)" },
  ]
};

window.ALPHABET_DATA = ALPHABET_DATA;
