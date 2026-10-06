# Translation Review & i18n Verification Matrix

This document tracks the multilingual translation coverage for **Safe Hands Human Resources Organization (SHHRO)** across all 22 supported languages.

> [!NOTE]
> All non-English UI dictionaries have been generated using AI translation models and mapped in `src/lib/i18n/dictionaries.ts`. Native speakers of respective languages should audit and refine the terms prior to formal state production rollout.

## Supported Languages & Status Matrix

| # | Language Name | Code | Script | Direction | Translation Status | Native Review Status |
|---|---------------|------|--------|-----------|--------------------|----------------------|
| 1 | English | `en` | Latin | LTR | Base / Master | Verified |
| 2 | தமிழ் (Tamil) | `ta` | Tamil | LTR | Complete | Pending Review |
| 3 | हिन्दी (Hindi) | `hi` | Devanagari | LTR | Complete | Pending Review |
| 4 | తెలుగు (Telugu) | `te` | Telugu | LTR | English Fallback | Pending Review |
| 5 | ಕನ್ನಡ (Kannada) | `kn` | Kannada | LTR | English Fallback | Pending Review |
| 6 | मराठी (Marathi) | `mr` | Devanagari | LTR | English Fallback | Pending Review |
| 7 | বাঙালি (Bengali) | `bn` | Bengali | LTR | English Fallback | Pending Review |
| 8 | اردو (Urdu) | `ur` | Arabic/Nastaliq | RTL | Complete (RTL Layout) | Pending Review |
| 9 | ગુજરાતી (Gujarati) | `gu` | Gujarati | LTR | English Fallback | Pending Review |
| 10 | മലയാളം (Malayalam) | `ml` | Malayalam | LTR | English Fallback | Pending Review |
| 11 | ਪੰਜਾਬੀ (Punjabi) | `pa` | Gurmukhi | LTR | English Fallback | Pending Review |
| 12 | ଓଡ଼ିଆ (Odia) | `or` | Odia | LTR | English Fallback | Pending Review |
| 13 | অসমীয়া (Assamese) | `as` | Bengali-Assamese | LTR | English Fallback | Pending Review |
| 14 | संस्कृतम् (Sanskrit) | `sa` | Devanagari | LTR | English Fallback | Pending Review |
| 15 | कोंकणी (Konkani) | `kok` | Devanagari | LTR | English Fallback | Pending Review |
| 16 | Español (Spanish) | `es` | Latin | LTR | English Fallback | Pending Review |
| 17 | 中文 (Chinese) | `zh` | Han (Simplified) | LTR | English Fallback | Pending Review |
| 18 | Français (French) | `fr` | Latin | LTR | English Fallback | Pending Review |
| 19 | عربى (Arabic) | `ar` | Arabic | RTL | Complete (RTL Layout) | Pending Review |
| 20 | Português (Portuguese) | `pt` | Latin | LTR | English Fallback | Pending Review |
| 21 | Русский (Russian) | `ru` | Cyrillic | LTR | English Fallback | Pending Review |
| 22 | 日本語 (Japanese) | `ja` | Japanese | LTR | English Fallback | Pending Review |

## Key Technical Details
- **RTL Support**: Urdu (`ur`) and Arabic (`ar`) trigger automatic `dir="rtl"` layout recalculations on container components.
- **Fallback Logic**: Any key missing in a secondary language dictionary automatically renders the Master English (`en`) equivalent to avoid blank spaces or runtime breaks.
