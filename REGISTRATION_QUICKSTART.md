# Club Registration Quick Start Guide

## Access the Form
Navigate to: `http://localhost:5173/signup/club`

## Example Registration Flow

### Step 1: Manager Information
```
Full Name: John Doe
Email: john.doe@testclub.com
Phone: +234 803 456 7890
```
Click **Next** →

### Step 2: Location & Contact
```
Country: 🇳🇬 Nigeria (searchable)
Country Code: 🇳🇬 +234 (auto-populated)
Club Phone: 812 345 6789
```
Click **Next** →

### Step 3: Club Details
```
Club Name: Lagos United FC
Sport: ⚽ Football (Soccer)
Year Founded: 2015
League: MPFL (Nigerian-specific)
Division: Division 1
```
Click **Next** →

### Step 4: Additional Information
```
Website: https://lagosunitedfc.com (optional)
Password: SecurePass123
Confirm Password: SecurePass123
```
Click **Create Account** →

### Result
✅ Account created
✅ Automatically logged in
✅ Redirected to dashboard

## Nigerian Football Leagues Available

When you select:
- Country: **Nigeria**
- Sport: **Football (Soccer)**

You'll see these leagues:
1. **MPFL** → Divisions: Division 1, Division 2
2. **NLO** → Divisions: Division 1, Division 2, Division 3
3. **Nigeria Metro League** → Divisions: Premier, Division 1
4. **NNL** → Divisions: Group A, Group B
5. **ATO Cup** → Divisions: Preliminary, Main Draw
6. **VALJETS Cup** → Divisions: Preliminary, Main Draw
7. **Discovery Cup** → Divisions: Open

## Search Features

### Country Search
Type "nig" → Shows Nigeria
Type "uni" → Shows United States, United Kingdom, United Arab Emirates

### Sports Search
Type "foot" → Shows Football (Soccer), American Football
Type "ball" → Shows Football, Basketball, Volleyball, Handball

### League Search
(After selecting Nigeria + Football)
Type "cup" → Shows ATO Cup, VALJETS Cup, Discovery Cup
Type "nlo" → Shows NLO

## Validation Messages

### Common Errors
❌ "Manager name is required"
❌ "Invalid email format"
❌ "Country is required"
❌ "Year must be between 1800 and 2024"
❌ "League is required"
❌ "Password must be at least 6 characters"
❌ "Passwords do not match"

## Features You'll Notice

✨ **Progress Sidebar**
- Visual steps with icons
- Checkmarks for completed steps
- Current step highlighted

✨ **Smart Auto-Fill**
- Select Nigeria → Country code becomes +234
- Change country → League resets
- Change sport → League resets
- Select league → Division options update

✨ **Searchable Dropdowns**
- Click dropdown → Search box appears
- Type to filter options
- Click to select
- Auto-closes after selection

✨ **Validation**
- Can't proceed with errors
- Red borders on invalid fields
- Clear error messages
- Real-time validation

✨ **Navigation**
- Back button to return to previous step
- Next button to advance
- Progress saved in form state
- Login link on every step

## Testing Different Scenarios

### Test Nigerian Club
```
Country: Nigeria
Sport: Football (Soccer)
League: MPFL
Division: Division 1
```

### Test UK Club
```
Country: United Kingdom
Sport: Football (Soccer)
League: Premier League
Division: Top Division
```

### Test US Basketball Club
```
Country: United States
Sport: Basketball
League: G League
Division: East
```

### Test Generic Club (No Specific League)
```
Country: India
Sport: Cricket
League: Professional League (generic)
Division: Division 1
```

## Troubleshooting

### Q: I don't see any leagues
**A:** Make sure you've selected both Country AND Sport

### Q: Division dropdown is empty
**A:** Select a league first

### Q: Country code didn't auto-fill
**A:** Make sure you selected the country from the dropdown, not just typed it

### Q: Can't submit form
**A:** Check all required fields (marked with *) are filled and have no errors

### Q: Form submission fails
**A:** Check browser console for errors. Common issues:
- Network connection
- Supabase credentials not set
- Email already registered

## Data Stored

After successful registration, data is stored in:

**Supabase Auth (auth.users)**
- Email: john.doe@testclub.com
- Password: (hashed)
- Metadata: { user_type: 'club' }

**Profiles Table**
- id: (UUID from auth.users)
- user_type: 'club'
- email: john.doe@testclub.com
- phone: +234 803 456 7890

**Clubs Table**
- profile_id: (links to profile)
- club_name: Lagos United FC
- country: Nigeria
- league: MPFL
- division: Division 1
- founded_year: 2015
- website: https://lagosunitedfc.com
- contact_phone: +234 812 345 6789

## Advanced Features

### Override Country Code
1. Select country (e.g., Nigeria → +234)
2. Click country code dropdown
3. Search and select different code
4. Your choice overrides auto-selection

### Return to Previous Step
1. Click "Back" button
2. Your data is preserved
3. Make changes if needed
4. Click "Next" to continue

### Switch to Login
- Click "Login here" link at bottom
- Available on all steps
- Form data not saved (start fresh after login)

## Browser Compatibility

✅ Chrome (recommended)
✅ Firefox
✅ Safari
✅ Edge
✅ Mobile browsers

## Keyboard Shortcuts

- **Tab** → Navigate between fields
- **Enter** → Submit form (on last step)
- **Escape** → Close dropdown (when open)
- **Arrow Keys** → Navigate dropdown options

## Next Steps After Registration

1. **View Dashboard** → See club overview
2. **Add Players** → Navigate to player management
3. **Upload Matches** → Add match videos
4. **Complete Profile** → Add logo, stadium info
5. **Explore Features** → AI scouting, transfers, etc.

## Support

Having issues? Check:
1. Browser console for errors
2. Network tab for failed requests
3. Supabase dashboard for database records
4. CLUB_REGISTRATION_GUIDE.md for detailed documentation

## Summary

The multi-step club registration form provides:
✅ Guided 4-step process
✅ Nigerian league support (7 leagues)
✅ Searchable dropdowns with flags/icons
✅ Smart auto-population
✅ Comprehensive validation
✅ Beautiful, modern design
✅ Full database integration

Start registering clubs today at `/signup/club`!