# WCB Lock, Farming, Credits, and Prize Pool

Dokumen singkat ini menjelaskan mekanisme lock $WCB supaya alurnya jelas saat dipakai untuk promosi.

## Prinsip Utama

1. User tidak membakar token.
   $WCB dikunci lewat Streamflow, bukan ditahan manual oleh WCB. User bisa unlock melalui Streamflow setelah tanggal unlock.

2. Lock yang dihitung adalah lock Streamflow real.
   Website membaca data on-chain dari Streamflow saat wallet connect. Tidak ada mock, dummy, atau saldo manual untuk credits.

3. Lock term fixed 60 days.
   Sistem WCB hanya menghitung lock 60 hari sebagai lock yang eligible untuk credits.

4. Platform credits punya redeem/withdraw flow, tapi masih coming soon.
   Credits dipakai untuk akses, ranking, entry, dan fitur WCB lain. Credit redeem/withdraw belum aktif sampai rules dan timing dipublish.

5. Prize pool hanya dari creator fee.
   Locked user tokens tidak pernah dipakai untuk membayar reward, prize pool, atau campaign distribution.

## Alur Lock

1. User connect wallet.
2. Website membaca wallet dan lock Streamflow yang sudah ada.
3. User pilih jumlah $WCB untuk lock.
4. Durasi otomatis fixed 60 days.
5. Website menampilkan estimasi credits dan unlock date.
6. User lanjut ke Streamflow untuk approve lock.
7. Setelah lock aktif, website membaca data Streamflow.
8. Credits dan posisi leaderboard muncul otomatis berdasarkan wallet.
9. Setelah 60 hari, user unlock token melalui Streamflow.

## Credit Rate

Sebelum launch 11 Juni 2026:

```text
100 $WCB locked = 1 platform credit
```

Setelah launch 11 Juni 2026:

```text
200 $WCB locked = 1 platform credit
```

Contoh sebelum launch:

```text
Lock 10,000 $WCB selama 60 hari
Credits = 10,000 / 100
Credits = 100 credits
```

Contoh setelah launch:

```text
Lock 10,000 $WCB selama 60 hari
Credits = 10,000 / 200
Credits = 50 credits
```

## Farming

Farming di WCB bukan APY dan bukan passive income.

Farming berarti user mengumpulkan platform credits dan ranking dari lock activity yang bisa dipakai untuk campaign, access, tournament windows, atau fitur WCB lain saat rules sudah dipublish.

Formula sederhana:

```text
Credits = locked amount / active credit rate
Eligible lock = fixed 60-day Streamflow lock
```

## Prize Pool

Sumber prize pool hanya creator fee.

Kalimat yang harus konsisten:

```text
Prize pool credit is funded only from creator fee.
Locked user tokens are never used to fund rewards.
```

Yang aman ditampilkan:

- Creator fee source
- Allocation rate
- Last updated
- Published reward rules
- Status: live, estimate, atau coming soon

Jangan tampilkan reward besar sebagai janji payout kalau creator fee belum cukup dan rules belum dipublish.

## Credits, Redeem, dan Withdraw

Jangan tulis seolah credit WD/redeem sudah live.

Yang benar:

```text
Locked $WCB can be unlocked through Streamflow after 60 days.
Platform credit redeem/withdraw is coming soon and not active yet.
Exact rules, eligibility, and timing will be published before activation.
Real betting winnings are separate and only withdrawable if betting markets, settlement, and funding are live.
```

Pisahkan label:

```text
Unlock $WCB
Use Credits
Redeem/Withdraw Credits Coming Soon
Withdraw Winnings
```

Hindari label yang membuat user mengira fitur sudah live:

```text
Withdraw Credits
```

## Copy Promo Pendek

```text
Lock $WCB through Streamflow for 60 days. The app reads your real on-chain lock, gives wallet-bound WCB platform credits, and ranks you on the World Cup leaderboard.
```

```text
Early lock benefit: before June 11, 2026, 100 $WCB locked earns 1 credit. After launch, 200 $WCB locked earns 1 credit.
```

```text
Prize pool credit is funded only from creator fee. Locked user tokens are never used for rewards.
```

## Checklist Sebelum Promo Besar

- Streamflow lock link aktif.
- Wallet auto-detect lock data dari Streamflow.
- Durasi lock tertulis fixed 60 days.
- Credit rate sebelum dan setelah launch jelas.
- Credit redeem ditulis coming soon, bukan aktif.
- Prize pool source ditulis creator fee only.
- Tidak ada klaim APY, guaranteed profit, passive income, atau withdraw credits seolah sudah live.

## Ringkasan Narasi

WCB tidak meminta user membakar uang. User mengunci $WCB lewat Streamflow selama 60 hari, lalu website membaca lock on-chain untuk memberi platform credits dan leaderboard ranking. Credit redeem/withdraw masih coming soon dan belum aktif. Prize pool credit hanya berasal dari creator fee, bukan dari token yang dikunci user.
