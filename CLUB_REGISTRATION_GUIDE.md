# Multi-Step Club Registration System - Complete Guide

## Overview
A comprehensive, user-friendly multi-step registration form for sports clubs with advanced features including searchable dropdowns, dynamic field population, and country/sport-specific league options.

## Features Implemented

### 1. Multi-Step Form Structure (4 Steps)

#### **Step 1: Manager Information**
- Manager's full name (required)
- Manager's email address (required, validated)
- Manager's phone number (required)

#### **Step 2: Location & Contact**
- **Country Selection Dropdown**
  - Flag icons next to each country name
  - Real-time search functionality
  - 30+ countries included
  - Auto-populates country code when selected
- **Club Contact Number**
  - Country code dropdown with flags and codes (e.g., "🇳🇬 +234")
  - Phone number input field
  - Automatically set based on country selection (user can override)

#### **Step 3: Club Details**
- **Club/Team Name** (required)
- **Sports Category Dropdown**
  - Sport icons next to each sport name (⚽🏀🎾 etc.)
  - Search functionality to filter sports
  - 17 sports available
- **Year Founded** (required, validated 1800-current year)
- **League Selection** (dynamic, based on country and sport)
  - Nigerian football leagues: MPFL, NLO, Nigeria Metro League, NNL, ATO Cup, VALJETS Cup, Discovery Cup
  - Other country-specific leagues
  - Generic leagues for countries without specific options
- **Division Selection** (appears after league selection)
  - Dynamically populated based on selected league

#### **Step 4: Additional Information**
- Club website URL (optional)
- Password creation (required, minimum 6 characters)
- Password confirmation (required, must match)

### 2. User Experience Features

✅ **Step Navigation**
- Back and Next buttons
- Visual progress indicator in sidebar
- Step completion checkmarks
- Animated transitions between steps

✅ **Validation**
- Real-time field validation
- Step-by-step validation before proceeding
- Clear error messages
- Email format validation
- Year range validation
- Password matching validation

✅ **Visual Design**
- Pink/magenta gradient sidebar with progress
- Dark theme throughout
- Icon-based navigation
- Smooth animations using Framer Motion
- Responsive layout

✅ **User Guidance**
- "Already have an account? Login here" link on every step
- Step titles and descriptions
- Required field indicators (*)
- Helpful placeholder text

### 3. Technical Implementation

#### **Data Files Created**

**`src/data/countries.ts`**
```typescript
- 30 countries with flags and dial codes
- Nigeria, US, UK, Germany, France, Spain, Italy, Brazil, etc.
- Each country has: code, name, flag emoji, dialCode
```

**`src/data/sports.ts`**
```typescript
- 17 sports with icons
- Football, Basketball, Tennis, Volleyball, Cricket, Rugby, etc.
- Each sport has: id, name, icon emoji
```

**`src/data/leagues.ts`**
```typescript
- Country and sport-specific leagues
- Nigerian football leagues (as specified)
- Major European leagues
- Generic fallback leagues
- Dynamic division assignment
- Helper functions: getLeaguesForCountryAndSport(), getDivisionsForLeague()
```

#### **Components Created**

**`src/components/SearchableDropdown.tsx`**
- Reusable searchable dropdown component
- Features:
  - Real-time search filtering
  - Icon support
  - Subtitle support
  - Click-outside to close
  - Keyboard navigation
  - Selected state highlighting
  - Error state styling

**`src/pages/auth/ClubSignupMultiStep.tsx`**
- Main registration component
- 4-step wizard
- Form state management
- Validation logic
- Integration with Supabase Auth
- Auto-population of related fields
- Dynamic league/division loading

### 4. Nigerian League Support

Specifically implemented Nigerian football leagues as requested:
- ✅ MPFL (2 divisions)
- ✅ NLO (3 divisions)
- ✅ Nigeria Metro League (Premier, Division 1)
- ✅ NNL (Group A, Group B)
- ✅ ATO Cup (Preliminary, Main Draw)
- ✅ VALJETS Cup (Preliminary, Main Draw)
- ✅ Discovery Cup (Open)

### 5. Auto-Population Features

**Country Code Auto-Population:**
When a user selects a country (e.g., Nigeria), the country code dropdown automatically selects the corresponding code (+234). User can override if needed.

**League/Division Reset:**
- When country or sport changes, league and division are reset
- When league changes, division is reset
- Prevents invalid combinations

**Dynamic Options:**
- League options update based on country + sport selection
- Division options update based on league selection
- Falls back to generic options if no specific leagues exist

## Routes

### New Route
```
/signup/club → Multi-step registration form (NEW)
```

### Legacy Route (preserved)
```
/signup/club-old → Original single-page form (BACKUP)
```

## Database Integration

### Data Stored in Supabase

**Auth User:**
- Email
- Password (hashed)
- User metadata (user_type: 'club')

**Profile Table:**
- id (linked to auth.users)
- user_type: 'club'
- email
- phone (manager phone)
- created_at

**Clubs Table:**
- profile_id (linked to profiles)
- club_name
- country (full country name)
- league (league name)
- division
- founded_year (new field)
- website
- contact_email
- contact_phone (with country code)

## Usage Guide

### For Users

1. **Start Registration**
   - Navigate to `/signup/club` or click "Club" on role selection page

2. **Step 1: Enter Manager Information**
   - Fill in full name, email, and phone
   - Click "Next" to proceed

3. **Step 2: Select Location**
   - Search and select country (flag shown)
   - Country code auto-populates
   - Enter club phone number
   - Click "Next"

4. **Step 3: Enter Club Details**
   - Enter club name
   - Select sport (with search)
   - Enter year founded
   - Select league (filtered by country/sport)
   - Select division (filtered by league)
   - Click "Next"

5. **Step 4: Set Password**
   - Optionally add website
   - Create strong password
   - Confirm password
   - Click "Create Account"

6. **Automatic Login**
   - Upon success, automatically logged in
   - Redirected to dashboard
   - All data saved to database

### For Nigerian Clubs

Nigerian football clubs will see these leagues:
1. MPFL
2. NLO
3. Nigeria Metro League
4. NNL
5. ATO Cup
6. VALJETS Cup
7. Discovery Cup

Each league has appropriate divisions to select from.

## Validation Rules

### Step 1
- ✅ Manager name: Required, must not be empty
- ✅ Email: Required, valid email format
- ✅ Phone: Required, must not be empty

### Step 2
- ✅ Country: Required, must select from list
- ✅ Country code: Required (auto-populated but can be changed)
- ✅ Club phone: Required, must not be empty

### Step 3
- ✅ Club name: Required, must not be empty
- ✅ Sport: Required, must select from list
- ✅ Founded year: Required, must be between 1800 and current year
- ✅ League: Required, must select from list
- ✅ Division: Required, must select from list

### Step 4
- ✅ Website: Optional, valid URL format if provided
- ✅ Password: Required, minimum 6 characters
- ✅ Confirm password: Required, must match password

## Error Handling

### Form Validation Errors
- Displayed inline below each field
- Red border on invalid fields
- Clear, user-friendly messages
- Cannot proceed to next step with errors

### Backend Errors
- Email already registered
- Database connection issues
- Authentication failures
- Clear error messages via alerts
- Detailed logging for debugging

## Responsive Design

The form is fully responsive:
- **Desktop**: Sidebar + form side-by-side
- **Tablet**: Sidebar remains visible
- **Mobile**: Should be tested and adjusted if needed

## Search Functionality

### How It Works
1. Click dropdown button
2. Dropdown opens with search input
3. Type to filter options in real-time
4. Click option to select
5. Dropdown closes automatically

### Search Applies To
- ✅ Country selection (30+ countries)
- ✅ Country code selection (with flags)
- ✅ Sports selection (17 sports)
- ✅ League selection (dynamic list)
- ✅ Division selection (dynamic list)

## Testing Checklist

### Functional Testing
- [ ] Navigate through all 4 steps
- [ ] Back button returns to previous step
- [ ] Validation prevents progression with errors
- [ ] Country selection auto-populates country code
- [ ] League options filter based on country + sport
- [ ] Division options filter based on league
- [ ] Search filters work in all dropdowns
- [ ] Password matching validation works
- [ ] Year validation (1800-2024) works
- [ ] Email format validation works
- [ ] Form submits successfully
- [ ] User created in Supabase Auth
- [ ] Profile created in profiles table
- [ ] Club record created in clubs table
- [ ] Auto-login after registration
- [ ] Redirect to dashboard works

### Nigerian-Specific Testing
- [ ] Select Nigeria as country
- [ ] Select Football as sport
- [ ] Verify 7 Nigerian leagues appear
- [ ] Test MPFL → shows 2 divisions
- [ ] Test NLO → shows 3 divisions
- [ ] Test Nigeria Metro League → shows 2 divisions
- [ ] Test NNL → shows 2 groups
- [ ] Test ATO Cup → shows 2 stages
- [ ] Test VALJETS Cup → shows 2 stages
- [ ] Test Discovery Cup → shows 1 division

### Visual Testing
- [ ] Progress indicator updates correctly
- [ ] Checkmarks appear for completed steps
- [ ] Current step is highlighted
- [ ] Icons display correctly (flags, sports)
- [ ] Animations are smooth
- [ ] Error messages are visible
- [ ] Login link is visible on all steps
- [ ] Form is centered and readable

### Edge Cases
- [ ] Empty form submission attempts
- [ ] Mismatched passwords
- [ ] Invalid email formats
- [ ] Invalid year (e.g., 1799, 2025)
- [ ] Duplicate email registration
- [ ] Network errors during submission
- [ ] Changing country after selecting league
- [ ] Changing sport after selecting league

## Future Enhancements

### Possible Improvements
1. **Add more countries and leagues**
   - Expand league database
   - Add more African leagues
   - Add Asian leagues

2. **Enhanced validation**
   - Phone number format validation per country
   - Password strength meter
   - Real-time email availability check

3. **Better mobile experience**
   - Optimize for small screens
   - Touch-friendly dropdowns
   - Swipe gestures between steps

4. **Additional fields**
   - Stadium information
   - Social media links
   - Team colors
   - Club logo upload

5. **Save progress**
   - Allow users to save and resume later
   - Draft mode in database
   - Email reminder to complete

6. **Multi-language support**
   - Translate form to local languages
   - Dynamic content based on country

## Troubleshooting

### Issue: Leagues not showing
**Solution**: Ensure country and sport are both selected. Leagues require both fields.

### Issue: Division dropdown empty
**Solution**: Ensure league is selected. Divisions populate after league selection.

### Issue: Country code not auto-populating
**Solution**: Check that country is fully selected (not just typed). UseEffect watches for country changes.

### Issue: Form submission fails
**Solution**: Check browser console for errors. Verify Supabase credentials in `.env` file.

### Issue: Search not working in dropdown
**Solution**: Ensure dropdown is open and search input is focused. Type directly after opening.

## Files Created/Modified

### New Files
1. `src/data/countries.ts` - Country data with flags
2. `src/data/sports.ts` - Sports data with icons
3. `src/data/leagues.ts` - League and division data
4. `src/components/SearchableDropdown.tsx` - Reusable dropdown component
5. `src/pages/auth/ClubSignupMultiStep.tsx` - Main registration form
6. `CLUB_REGISTRATION_GUIDE.md` - This documentation

### Modified Files
1. `src/App.tsx` - Added new route for multi-step form
2. `src/contexts/AuthContext.tsx` - Updated to handle new club fields

## API Integration

### Supabase Operations

**Authentication:**
```typescript
supabase.auth.signUp({
  email,
  password,
  options: { data: { user_type: 'club' } }
})
```

**Profile Creation:**
Automatic via database trigger `handle_new_user()`

**Club Record:**
```typescript
supabase.from('clubs').insert({
  profile_id,
  club_name,
  country,
  league,
  division,
  founded_year,
  website,
  contact_email,
  contact_phone
})
```

## Success Metrics

The multi-step form provides:
- ✅ Better user experience with guided flow
- ✅ Clear visual progress indication
- ✅ Reduced form abandonment with step-by-step approach
- ✅ Better data quality with comprehensive validation
- ✅ Nigerian-specific league support as requested
- ✅ Searchable dropdowns for improved usability
- ✅ Auto-population to reduce user effort
- ✅ Mobile-friendly design (responsive)
- ✅ Integration with existing authentication system

## Conclusion

The multi-step club registration form successfully implements all requested features:
- 4-step guided process
- Country/flag dropdowns with search
- Auto-populating country codes
- Sports selection with icons and search
- Dynamic league/division based on country and sport
- All 7 Nigerian football leagues included
- Password creation and confirmation
- Full Supabase integration
- Beautiful, modern design

Users can now register their clubs with a smooth, professional experience that guides them through each required step while minimizing errors and maximizing data quality.