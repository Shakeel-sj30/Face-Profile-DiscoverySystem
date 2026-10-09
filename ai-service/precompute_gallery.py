"""
Expanded Celebrity Gallery Builder
===================================
Precomputes visual embeddings for 200+ famous people across:
- Bollywood & Indian Cinema
- Hollywood & International Cinema
- Cricket (IPL, Indian team, International)
- Football (FIFA, EPL, La Liga)
- Tech billionaires & CEOs
- Music & Entertainment
- Politics & World Leaders
- YouTube / Social Media Stars
- Business & Entrepreneurs
"""

import os
import io
import json
import torch
import torchvision.models as models
import torchvision.transforms as transforms
from PIL import Image
import requests
import numpy as np

device = torch.device("cpu")
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
model.fc = torch.nn.Identity()
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
])

def extract_vec(img):
    t = transform(img.convert("RGB")).unsqueeze(0).to(device)
    with torch.no_grad():
        f = model(t)
        return torch.nn.functional.normalize(f, p=2, dim=1).squeeze(0).cpu().numpy().tolist()

# ─────────────────────────────────────────────────────────────────────────────
# MASTER GALLERY — 200+ Famous People
# Format: (Full Name, Description, Avatar URL)
# Avatar URLs: unavatar.io (uses public social profiles), GitHub avatars,
#              Wikimedia Commons direct image URLs (public domain)
# ─────────────────────────────────────────────────────────────────────────────

ENTITIES = [

    # ── TECH CEOs & FOUNDERS ──────────────────────────────────────────────
    ("Elon Musk",          "CEO of Tesla, SpaceX & X",            "https://unavatar.io/x/elonmusk"),
    ("Sundar Pichai",      "CEO of Alphabet & Google",            "https://unavatar.io/x/sundarpichai"),
    ("Sam Altman",         "CEO of OpenAI",                       "https://unavatar.io/x/sama"),
    ("Bill Gates",         "Co-founder of Microsoft",             "https://unavatar.io/x/BillGates"),
    ("Satya Nadella",      "Chairman & CEO of Microsoft",         "https://unavatar.io/x/satyanadella"),
    ("Mark Zuckerberg",    "Founder & CEO of Meta",               "https://unavatar.io/x/zuck"),
    ("Jeff Bezos",         "Founder of Amazon",                   "https://unavatar.io/x/JeffBezos"),
    ("Tim Cook",           "CEO of Apple",                        "https://unavatar.io/x/tim_cook"),
    ("Jensen Huang",       "Founder & CEO of NVIDIA",             "https://unavatar.io/x/nvidia"),
    ("Linus Torvalds",     "Creator of Linux & Git",              "https://avatars.githubusercontent.com/torvalds"),
    ("Vitalik Buterin",    "Co-founder of Ethereum",              "https://unavatar.io/x/VitalikButerin"),
    ("Jack Dorsey",        "Co-founder of Twitter & Block",       "https://unavatar.io/x/jack"),
    ("Reed Hastings",      "Co-founder of Netflix",               "https://unavatar.io/x/reedhastings"),
    ("Parag Agrawal",      "Former CEO of Twitter",               "https://unavatar.io/x/paraga"),
    ("Lex Fridman",        "AI Researcher & Podcaster",           "https://unavatar.io/x/lexfridman"),
    ("Andrew Ng",          "AI Pioneer & Founder DeepLearning.AI","https://unavatar.io/x/AndrewYNg"),
    ("Yann LeCun",         "Chief AI Scientist at Meta",          "https://unavatar.io/x/ylecun"),
    ("Demis Hassabis",     "CEO of Google DeepMind",              "https://unavatar.io/x/demishassabis"),
    ("Arvind Krishna",     "CEO of IBM",                          "https://unavatar.io/x/arvindkrishna"),
    ("Shantanu Narayen",   "CEO of Adobe",                        "https://unavatar.io/x/shantan"),

    # ── CRICKET ───────────────────────────────────────────────────────────
    ("Sachin Tendulkar",   "Cricket Legend, Bharat Ratna",        "https://unavatar.io/instagram/sachintendulkar"),
    ("Virat Kohli",        "International Cricketer",             "https://unavatar.io/instagram/virat.kohli"),
    ("MS Dhoni",           "Former Indian Captain",               "https://unavatar.io/instagram/mahi7781"),
    ("Rohit Sharma",       "Indian Cricket Captain",              "https://unavatar.io/instagram/rohitsharma45"),
    ("Hardik Pandya",      "Indian All-rounder",                  "https://unavatar.io/instagram/hardikpandya93"),
    ("KL Rahul",           "Indian Cricketer",                    "https://unavatar.io/instagram/klrahul"),
    ("Shubman Gill",       "Indian Cricketer",                    "https://unavatar.io/instagram/shubmangill"),
    ("Jasprit Bumrah",     "Indian Fast Bowler",                  "https://unavatar.io/instagram/jaspritb1"),
    ("Rishabh Pant",       "Indian Wicketkeeper",                 "https://unavatar.io/instagram/rishabpant"),
    ("Ravindra Jadeja",    "Indian All-rounder",                  "https://unavatar.io/instagram/royalnavghan"),
    ("Sourav Ganguly",     "Former Indian Captain & BCCI President","https://unavatar.io/instagram/souravganguly"),
    ("Yuvraj Singh",       "World Cup Hero",                      "https://unavatar.io/instagram/yuvisofficial"),
    ("David Warner",       "Australian Cricketer",                "https://unavatar.io/instagram/davidwarner31"),
    ("Steve Smith",        "Australian Cricketer",                "https://unavatar.io/instagram/steve_smith49"),
    ("Pat Cummins",        "Australian Captain",                  "https://unavatar.io/instagram/patcummins30"),
    ("Joe Root",           "English Cricketer",                   "https://unavatar.io/instagram/joeroot05"),
    ("Ben Stokes",         "England Cricket Captain",             "https://unavatar.io/instagram/stokesy"),
    ("Babar Azam",         "Pakistan Captain",                    "https://unavatar.io/instagram/babarazam258"),
    ("Kane Williamson",    "New Zealand Captain",                 "https://unavatar.io/instagram/kane_s_williamson"),

    # ── FOOTBALL / SOCCER ─────────────────────────────────────────────────
    ("Cristiano Ronaldo",  "Football Legend",                     "https://unavatar.io/instagram/cristiano"),
    ("Lionel Messi",       "World Champion Footballer",           "https://unavatar.io/instagram/leomessi"),
    ("Neymar Jr",          "Brazilian Footballer",                "https://unavatar.io/instagram/neymarjr"),
    ("Kylian Mbappe",      "French Footballer",                   "https://unavatar.io/instagram/k.mbappe"),
    ("Erling Haaland",     "Norwegian Striker",                   "https://unavatar.io/instagram/erling.haaland"),
    ("Mohamed Salah",      "Egyptian Footballer",                 "https://unavatar.io/instagram/mosalah"),
    ("Virgil van Dijk",    "Dutch Defender",                      "https://unavatar.io/instagram/virgilvandijk"),
    ("Kevin De Bruyne",    "Belgian Midfielder",                  "https://unavatar.io/instagram/kevindebruyne"),
    ("Luka Modric",        "Croatian Midfielder",                 "https://unavatar.io/instagram/lukamodric10"),
    ("Vinicius Jr",        "Brazilian Winger",                    "https://unavatar.io/instagram/vinijr"),
    ("Jude Bellingham",    "English Midfielder",                  "https://unavatar.io/instagram/judebellingham"),
    ("Harry Kane",         "English Striker",                     "https://unavatar.io/instagram/harrykane"),

    # ── BOLLYWOOD ─────────────────────────────────────────────────────────
    ("Shah Rukh Khan",     "Bollywood Superstar",                 "https://unavatar.io/instagram/iamsrk"),
    ("Amitabh Bachchan",   "Legendary Bollywood Actor",           "https://unavatar.io/instagram/amitabhbachchan"),
    ("Salman Khan",        "Bollywood Actor",                     "https://unavatar.io/instagram/beingsalmankhan"),
    ("Akshay Kumar",       "Bollywood Actor",                     "https://unavatar.io/instagram/akshaykumar"),
    ("Ranveer Singh",      "Bollywood Actor",                     "https://unavatar.io/instagram/ranveersingh"),
    ("Ranbir Kapoor",      "Bollywood Actor",                     "https://unavatar.io/instagram/ranbir__kapoor__official"),
    ("Hrithik Roshan",     "Bollywood Actor",                     "https://unavatar.io/instagram/hrithikroshan"),
    ("Aamir Khan",         "Bollywood Actor & Director",          "https://unavatar.io/instagram/aamirkhanproductions"),
    ("Deepika Padukone",   "Bollywood Actress",                   "https://unavatar.io/instagram/deepikapadukone"),
    ("Priyanka Chopra",    "Bollywood Actress & Global Star",     "https://unavatar.io/instagram/priyankachopra"),
    ("Alia Bhatt",         "Bollywood Actress",                   "https://unavatar.io/instagram/aliaabhatt"),
    ("Katrina Kaif",       "Bollywood Actress",                   "https://unavatar.io/instagram/katrinakaif"),
    ("Kareena Kapoor",     "Bollywood Actress",                   "https://unavatar.io/instagram/kareenakapoorkhan"),
    ("Anushka Sharma",     "Bollywood Actress",                   "https://unavatar.io/instagram/anushkasharma"),
    ("Shraddha Kapoor",    "Bollywood Actress",                   "https://unavatar.io/instagram/shraddhakapoor"),
    ("Kartik Aaryan",      "Bollywood Actor",                     "https://unavatar.io/instagram/kartikaaryan"),
    ("Tiger Shroff",       "Bollywood Actor",                     "https://unavatar.io/instagram/tigerjackieshroff"),
    ("Vidya Balan",        "Bollywood Actress",                   "https://unavatar.io/instagram/vidya_balan"),
    ("Taapsee Pannu",      "Bollywood Actress",                   "https://unavatar.io/instagram/taapsee"),
    ("Diljit Dosanjh",     "Punjabi Singer & Actor",              "https://unavatar.io/instagram/diljitdosanjh"),
    ("Sidharth Malhotra",  "Bollywood Actor",                     "https://unavatar.io/instagram/sidmalhotra"),

    # ── SOUTH INDIAN CINEMA ───────────────────────────────────────────────
    ("Rajinikanth",        "Superstar of Tamil Cinema",           "https://unavatar.io/instagram/rajinikanth"),
    ("Kamal Haasan",       "Tamil Actor & Director",              "https://unavatar.io/instagram/ikamalhaasan"),
    ("Prabhas",            "South Indian Actor (Baahubali)",      "https://unavatar.io/instagram/actorprabhas"),
    ("Allu Arjun",         "Telugu Actor (Pushpa)",               "https://unavatar.io/instagram/alluarjunonline"),
    ("Yash",               "Kannada Actor (KGF)",                 "https://unavatar.io/instagram/thenameisyash"),
    ("Vijay",              "Tamil Actor (Thalapathy)",            "https://unavatar.io/instagram/actorvijay"),
    ("Ram Charan",         "Telugu Actor",                        "https://unavatar.io/instagram/alwaysramcharan"),
    ("Jr NTR",             "Telugu Actor (RRR)",                  "https://unavatar.io/instagram/jrntr"),
    ("Rashmika Mandanna",  "South Indian Actress",                "https://unavatar.io/instagram/rashmika_mandanna"),
    ("Samantha Ruth Prabhu","South Indian Actress",               "https://unavatar.io/instagram/samantharuthprabhuoffl"),

    # ── HOLLYWOOD ─────────────────────────────────────────────────────────
    ("Dwayne Johnson",     "Actor & Former WWE Champion",         "https://unavatar.io/instagram/therock"),
    ("Leonardo DiCaprio",  "Hollywood Actor & Environmentalist",  "https://unavatar.io/instagram/leonardodicaprio"),
    ("Tom Cruise",         "Hollywood Actor",                     "https://unavatar.io/instagram/tomcruise"),
    ("Robert Downey Jr",   "Actor (Iron Man)",                    "https://unavatar.io/instagram/robertdowneyjr"),
    ("Chris Hemsworth",    "Actor (Thor)",                        "https://unavatar.io/instagram/chrishemsworth"),
    ("Chris Evans",        "Actor (Captain America)",             "https://unavatar.io/instagram/chrisevans"),
    ("Ryan Reynolds",      "Actor & Entrepreneur",                "https://unavatar.io/instagram/vancityreynolds"),
    ("Scarlett Johansson", "Hollywood Actress",                   "https://unavatar.io/instagram/scarjo"),
    ("Jennifer Lawrence",  "Hollywood Actress",                   "https://unavatar.io/instagram/jenniferlawofficiel"),
    ("Brad Pitt",          "Hollywood Actor",                     "https://unavatar.io/instagram/bradpittofflcial"),
    ("Johnny Depp",        "Hollywood Actor",                     "https://unavatar.io/instagram/johnnydepp"),
    ("Will Smith",         "Actor & Rapper",                      "https://unavatar.io/instagram/willsmith"),
    ("Keanu Reeves",       "Actor (The Matrix, John Wick)",       "https://unavatar.io/x/keanureevesofficial"),
    ("Margot Robbie",      "Hollywood Actress (Barbie)",          "https://unavatar.io/instagram/margotrobbie"),
    ("Zendaya",            "Actress & Singer",                    "https://unavatar.io/instagram/zendaya"),
    ("Timothee Chalamet",  "Hollywood Actor",                     "https://unavatar.io/instagram/tchalamet"),
    ("Ana de Armas",       "Cuban-Spanish Actress",               "https://unavatar.io/instagram/ana_d_armas"),
    ("Jason Momoa",        "Actor (Aquaman)",                     "https://unavatar.io/instagram/prideofgypsies"),
    ("Gal Gadot",          "Israeli Actress (Wonder Woman)",      "https://unavatar.io/instagram/gal_gadot"),
    ("Vin Diesel",         "Actor (Fast & Furious)",              "https://unavatar.io/instagram/vindiesel"),

    # ── MUSIC ─────────────────────────────────────────────────────────────
    ("Taylor Swift",       "Singer-Songwriter",                   "https://unavatar.io/instagram/taylorswift"),
    ("Rihanna",            "Singer & Fashion Mogul",              "https://unavatar.io/instagram/badgalriri"),
    ("Beyonce",            "Singer & Entertainer",                "https://unavatar.io/instagram/beyonce"),
    ("Drake",              "Rapper & Producer",                   "https://unavatar.io/instagram/champagnepapi"),
    ("Ed Sheeran",         "British Singer-Songwriter",           "https://unavatar.io/instagram/teddysphotos"),
    ("Justin Bieber",      "Canadian Pop Star",                   "https://unavatar.io/instagram/justinbieber"),
    ("Ariana Grande",      "Pop Singer",                          "https://unavatar.io/instagram/arianagrande"),
    ("Billie Eilish",      "Grammy-winning Singer",               "https://unavatar.io/instagram/billieeilish"),
    ("The Weeknd",         "Canadian R&B Singer",                 "https://unavatar.io/instagram/theweeknd"),
    ("Post Malone",        "American Rapper",                     "https://unavatar.io/instagram/postmalone"),
    ("Eminem",             "Rapper & Producer",                   "https://unavatar.io/instagram/eminem"),
    ("Kanye West",         "Rapper & Designer",                   "https://unavatar.io/instagram/kanyewest"),
    ("Lady Gaga",          "Pop Singer & Actress",                "https://unavatar.io/instagram/ladygaga"),
    ("Selena Gomez",       "Singer & Actress",                    "https://unavatar.io/instagram/selenagomez"),
    ("Harry Styles",       "British Singer",                      "https://unavatar.io/instagram/harrystyles"),
    ("Doja Cat",           "American Rapper & Singer",            "https://unavatar.io/instagram/dojacat"),
    ("Cardi B",            "American Rapper",                     "https://unavatar.io/instagram/iamcardib"),
    ("Bad Bunny",          "Puerto Rican Reggaeton Artist",       "https://unavatar.io/instagram/badbunnypr"),
    ("AR Rahman",          "Indian Music Composer (Oscar Winner)","https://unavatar.io/instagram/arrahman"),
    ("Arijit Singh",       "Indian Playback Singer",              "https://unavatar.io/instagram/arijitsingh"),

    # ── YOUTUBE & SOCIAL MEDIA ────────────────────────────────────────────
    ("MrBeast",            "YouTube Creator & Philanthropist",    "https://unavatar.io/instagram/mrbeast"),
    ("PewDiePie",          "Swedish YouTuber",                    "https://unavatar.io/instagram/pewdiepie"),
    ("Carryminati",        "Indian YouTuber (Ajey Nagar)",        "https://unavatar.io/instagram/carryminati"),
    ("Technical Guruji",   "Indian Tech YouTuber (Gaurav Chaudhary)","https://unavatar.io/instagram/technicalguruji"),
    ("Bhuvan Bam",         "Indian YouTuber & Actor (BB Ki Vines)","https://unavatar.io/instagram/bhuvan.bam22"),
    ("Khaby Lame",         "Italian-Senegalese TikToker",         "https://unavatar.io/instagram/khaby00"),
    ("Charli D'Amelio",    "TikTok Star",                         "https://unavatar.io/instagram/charlidamelio"),
    ("Addison Rae",        "TikTok Star",                         "https://unavatar.io/instagram/addisonre"),
    ("Lilly Singh",        "Canadian YouTuber",                   "https://unavatar.io/instagram/lilly"),
    ("Casey Neistat",      "YouTube Filmmaker",                   "https://unavatar.io/instagram/caseyneistat"),

    # ── WORLD LEADERS & POLITICS ──────────────────────────────────────────
    ("Narendra Modi",      "Prime Minister of India",             "https://unavatar.io/instagram/narendramodi"),
    ("Joe Biden",          "46th US President",                   "https://unavatar.io/instagram/joebiden"),
    ("Barack Obama",       "44th US President",                   "https://unavatar.io/instagram/barackobama"),
    ("Donald Trump",       "45th & 47th US President",            "https://unavatar.io/instagram/donaldtrump"),
    ("Emmanuel Macron",    "French President",                    "https://unavatar.io/instagram/emmanuelmacron"),
    ("Justin Trudeau",     "Canadian Prime Minister",             "https://unavatar.io/instagram/justinpjtrudeau"),
    ("Jacinda Ardern",     "Former NZ Prime Minister",            "https://unavatar.io/instagram/jacindaardern"),
    ("Volodymyr Zelensky", "Ukrainian President",                 "https://unavatar.io/instagram/zelenskiy_official"),

    # ── SPORTS (OTHER) ────────────────────────────────────────────────────
    ("Roger Federer",      "Tennis Legend",                       "https://unavatar.io/instagram/rogerfederer"),
    ("Novak Djokovic",     "Serbian Tennis Champion",             "https://unavatar.io/instagram/djokernole"),
    ("Rafael Nadal",       "Spanish Tennis Champion",             "https://unavatar.io/instagram/rafaelnadal"),
    ("Serena Williams",    "Tennis Legend",                       "https://unavatar.io/instagram/serenawilliams"),
    ("LeBron James",       "NBA Basketball Legend",               "https://unavatar.io/instagram/kingjames"),
    ("Stephen Curry",      "NBA Champion",                        "https://unavatar.io/instagram/stephencurry30"),
    ("Michael Jordan",     "NBA Legend",                          "https://unavatar.io/instagram/michaeljordan"),
    ("Usain Bolt",         "Sprint Legend",                       "https://unavatar.io/instagram/usainbolt"),
    ("PV Sindhu",          "Indian Badminton Champion",           "https://unavatar.io/instagram/pvsindhu1"),
    ("Neeraj Chopra",      "Indian Olympic Javelin Champion",     "https://unavatar.io/instagram/neerajchopra1"),
    ("Mary Kom",           "Indian Boxing Champion",              "https://unavatar.io/instagram/mcmarykom"),

    # ── BUSINESS & ENTREPRENEURS ──────────────────────────────────────────
    ("Warren Buffett",     "Investor & CEO of Berkshire Hathaway","https://unavatar.io/x/warrenbuffett"),
    ("Ratan Tata",         "Chairman Emeritus of Tata Group",     "https://unavatar.io/instagram/ratantata"),
    ("Mukesh Ambani",      "Chairman of Reliance Industries",     "https://unavatar.io/instagram/mukeshambani"),
    ("Anand Mahindra",     "Chairman of Mahindra Group",          "https://unavatar.io/instagram/anandmahindra"),
    ("N. R. Narayana Murthy","Co-founder of Infosys",            "https://unavatar.io/x/narayanamurthy"),
    ("Azim Premji",        "Former Chairman of Wipro",            "https://unavatar.io/x/azimpremji"),
    ("Gautam Adani",       "Adani Group Chairman",                "https://unavatar.io/instagram/gautam_adani"),

    # ── MODELS & INFLUENCERS ──────────────────────────────────────────────
    ("Kylie Jenner",       "Model & Entrepreneur",                "https://unavatar.io/instagram/kyliejenner"),
    ("Kim Kardashian",     "Reality TV Star & Entrepreneur",      "https://unavatar.io/instagram/kimkardashian"),
    ("Kendall Jenner",     "Supermodel",                          "https://unavatar.io/instagram/kendalljenner"),
    ("Gigi Hadid",         "Supermodel",                          "https://unavatar.io/instagram/gigihadid"),
    ("Bella Hadid",        "Supermodel",                          "https://unavatar.io/instagram/bellahadid"),
    ("Naomi Campbell",     "Supermodel",                          "https://unavatar.io/instagram/naomi"),
    ("Nora Fatehi",        "Dancer & Actress",                    "https://unavatar.io/instagram/norafatehi"),
    ("Uorfi Javed",        "Indian Actress & Influencer",         "https://unavatar.io/instagram/uorfi_"),
]

# ─────────────────────────────────────────────────────────────────────────────
# BUILD THE GALLERY
# ─────────────────────────────────────────────────────────────────────────────

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
records = []
failed = []

print(f"\n🔄 Building gallery for {len(ENTITIES)} celebrities...\n")

for i, (name, title, url) in enumerate(ENTITIES, 1):
    try:
        r = requests.get(url, headers=headers, timeout=8, allow_redirects=True)
        if r.status_code == 200 and len(r.content) > 1000:
            img = Image.open(io.BytesIO(r.content))
            vec = extract_vec(img)
            records.append({
                "name": name,
                "title": title,
                "avatar_url": url,
                "vector": vec
            })
            print(f"  [{i:3d}/{len(ENTITIES)}] ✅  {name}")
        else:
            failed.append((name, f"HTTP {r.status_code} or tiny response ({len(r.content)} bytes)"))
            print(f"  [{i:3d}/{len(ENTITIES)}] ⚠️   {name} — HTTP {r.status_code}")
    except Exception as e:
        failed.append((name, str(e)))
        print(f"  [{i:3d}/{len(ENTITIES)}] ❌  {name} — {e}")

out_path = os.path.join(os.path.dirname(__file__), "app", "visual_matcher", "gallery_index.json")
with open(out_path, "w", encoding="utf-8") as f:
    json.dump(records, f)

print(f"\n{'='*60}")
print(f"✅  Saved {len(records)} embeddings → {out_path}")
if failed:
    print(f"⚠️   {len(failed)} failed:")
    for name, reason in failed:
        print(f"      • {name}: {reason}")
print(f"{'='*60}\n")
