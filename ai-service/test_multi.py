from test_live_finder import search_social_profiles

for name in ['Zendaya', 'Sam Altman', 'Cristiano Ronaldo']:
    res = search_social_profiles(name)
    print(f'=== {name} ({len(res)} results) ===')
    for c in res[:3]:
        print(f"  {c['platform']}: {c['username']} -> {c['publicProfileUrl']}")
