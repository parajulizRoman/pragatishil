-- Create nepali_festivals table for special days and celebrations
CREATE TABLE IF NOT EXISTS nepali_festivals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name_en TEXT NOT NULL,
    name_ne TEXT NOT NULL,
    bs_month INTEGER NOT NULL CHECK (bs_month >= 0 AND bs_month <= 11), -- 0=Baisakh, 11=Chaitra
    bs_day INTEGER NOT NULL CHECK (bs_day >= 1 AND bs_day <= 32),
    description_en TEXT,
    description_ne TEXT,
    image_url TEXT,
    category TEXT CHECK (category IN ('religious', 'national', 'cultural', 'other')),
    is_public_holiday BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast lookups by month and day
CREATE INDEX idx_festivals_month_day ON nepali_festivals(bs_month, bs_day);
CREATE INDEX idx_festivals_category ON nepali_festivals(category);

-- Create daily_astrology table for caching astrology data
CREATE TABLE IF NOT EXISTS daily_astrology (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL UNIQUE,
    tithi TEXT,
    nakshatra TEXT,
    yoga TEXT,
    karana TEXT,
    sunrise TIME,
    sunset TIME,
    moon_phase TEXT CHECK (moon_phase IN ('new', 'waxing_crescent', 'first_quarter', 'waxing_gibbous', 'full', 'waning_gibbous', 'last_quarter', 'waning_crescent')),
    is_ekadashi BOOLEAN DEFAULT false,
    is_purnima BOOLEAN DEFAULT false,
    is_amavasya BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for fast date lookups
CREATE INDEX idx_astrology_date ON daily_astrology(date);
CREATE INDEX idx_astrology_special_days ON daily_astrology(is_ekadashi, is_purnima, is_amavasya);

-- Add RLS policies
ALTER TABLE nepali_festivals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_astrology ENABLE ROW LEVEL SECURITY;

-- Everyone can read festivals
CREATE POLICY "Festivals are viewable by everyone"
    ON nepali_festivals FOR SELECT
    USING (true);

-- Only admins can manage festivals
CREATE POLICY "Admins can manage festivals"
    ON nepali_festivals FOR ALL
    USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'yantrik'))
    );

-- Everyone can read astrology data
CREATE POLICY "Astrology data is viewable by everyone"
    ON daily_astrology FOR SELECT
    USING (true);

-- Only admins can manage astrology data
CREATE POLICY "Admins can manage astrology data"
    ON daily_astrology FOR ALL
    USING (
        auth.uid() IN (SELECT id FROM profiles WHERE role IN ('admin', 'yantrik'))
    );

-- Seed major Nepali festivals
INSERT INTO nepali_festivals (name_en, name_ne, bs_month, bs_day, category, is_public_holiday, description_en, description_ne) VALUES
-- Baisakh (Month 0)
('Nepali New Year', 'नेपाली नयाँ वर्ष', 0, 1, 'national', true, 'First day of Nepali calendar', 'नेपाली पात्रोको पहिलो दिन'),
('Buddha Purnima', 'बुद्ध पूर्णिमा', 1, 15, 'religious', true, 'Birth of Lord Buddha', 'भगवान बुद्धको जन्मदिन'),

-- Jestha (Month 1)
('Republic Day', 'गणतन्त्र दिवस', 1, 15, 'national', true, 'Nepal Republic Day', 'नेपाल गणतन्त्र दिवस'),

-- Shrawan (Month 3)
('Janai Purnima', 'जनै पूर्णिमा', 3, 15, 'religious', false, 'Sacred thread festival', 'जनै बदल्ने दिन'),
('Gai Jatra', 'गाई जात्रा', 3, 16, 'cultural', false, 'Cow festival', 'गाईको पूजा'),

-- Bhadra (Month 4)
('Krishna Janmashtami', 'कृष्ण जन्माष्टमी', 4, 8, 'religious', true, 'Birth of Lord Krishna', 'भगवान कृष्णको जन्मदिन'),
('Teej', 'तीज', 4, 18, 'cultural', false, 'Women''s festival', 'महिलाहरूको चाड'),

-- Ashwin (Month 5)
('Indra Jatra', 'इन्द्र जात्रा', 5, 1, 'cultural', false, 'Festival of Indra', 'इन्द्रको जात्रा'),
('Constitution Day', 'संविधान दिवस', 5, 3, 'national', true, 'Nepal Constitution Day', 'नेपाल संविधान दिवस'),
('Ghatasthapana', 'घटस्थापना', 5, 17, 'religious', false, 'Start of Dashain', 'दशैंको सुरुवात'),
('Phulpati', 'फूलपाती', 5, 23, 'religious', false, 'Seventh day of Dashain', 'दशैंको सातौं दिन'),
('Maha Ashtami', 'महा अष्टमी', 5, 24, 'religious', false, 'Eighth day of Dashain', 'दशैंको आठौं दिन'),
('Maha Navami', 'महा नवमी', 5, 25, 'religious', true, 'Ninth day of Dashain', 'दशैंको नवौं दिन'),
('Vijaya Dashami', 'विजया दशमी', 5, 26, 'religious', true, 'Main day of Dashain', 'दशैंको मुख्य दिन'),

-- Kartik (Month 6)
('Kojagrat Purnima', 'कोजाग्रत पूर्णिमा', 6, 15, 'religious', false, 'Full moon of Kartik', 'कार्तिकको पूर्णिमा'),
('Kag Tihar', 'काग तिहार', 6, 28, 'cultural', false, 'Crow worship', 'कागको पूजा'),
('Kukur Tihar', 'कुकुर तिहार', 6, 29, 'cultural', false, 'Dog worship', 'कुकुरको पूजा'),
('Laxmi Puja', 'लक्ष्मी पूजा', 6, 30, 'religious', true, 'Worship of Goddess Laxmi', 'लक्ष्मी देवीको पूजा'),
('Goru Tihar', 'गोरु तिहार', 7, 1, 'cultural', false, 'Ox worship', 'गोरुको पूजा'),
('Gobardhan Puja', 'गोवर्धन पूजा', 7, 1, 'religious', false, 'Mountain worship', 'गोवर्धन पूजा'),
('Bhai Tika', 'भाई टीका', 7, 2, 'cultural', true, 'Brother-sister festival', 'दाजुभाइ दिदीबहिनीको चाड'),

-- Mangsir (Month 7)
('Chhath', 'छठ', 7, 20, 'religious', false, 'Sun worship festival', 'सूर्य पूजा'),

-- Poush (Month 8)
('Yomari Punhi', 'योमरी पुन्ही', 8, 15, 'cultural', false, 'Newari festival', 'नेवारी चाड'),

-- Magh (Month 9)
('Maghe Sankranti', 'माघे संक्रान्ति', 9, 1, 'cultural', false, 'Winter solstice', 'माघे संक्रान्ति'),
('Basanta Panchami', 'बसन्त पञ्चमी', 9, 22, 'religious', false, 'Spring festival', 'बसन्त ऋतुको सुरुवात'),

-- Falgun (Month 10)
('Maha Shivaratri', 'महा शिवरात्रि', 10, 26, 'religious', true, 'Great night of Shiva', 'शिवको महान रात'),
('Holi', 'होली', 10, 30, 'cultural', true, 'Festival of colors', 'रङहरूको चाड'),

-- Chaitra (Month 11)
('Ghode Jatra', 'घोडे जात्रा', 11, 18, 'cultural', false, 'Horse racing festival', 'घोडा दौडको चाड')

ON CONFLICT DO NOTHING;

-- Add comments
COMMENT ON TABLE nepali_festivals IS 'Nepali festivals and special days with BS dates';
COMMENT ON TABLE daily_astrology IS 'Daily astrology and astronomical data cache';
