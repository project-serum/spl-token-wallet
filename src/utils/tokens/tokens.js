import { MAINNET_URL } from "../connection";

// This list is used for deciding what to display in the popular tokens list
// in the `AddTokenDialog`.
//
// Icons, names, and symbols are fetched not from here, but from the
// @solana/spl-token-registry. To add an icon or token name to the wallet,
// add the mints to that package. To add a token to the `AddTokenDialog`,

// add the `mintAddress` here. The rest of the fields are not used.
export const TOKENS = {
  [MAINNET_URL]: [
    {
      mintAddress: 'E5ndSkaB17Dm7CsD22dvcjfrYSDLCxFcMd6z8ddCk5wp',
      tokenSymbol: 'RIN',
    },
    {
      mintAddress: '4pk3pf9nJDN1im1kNwWJN1ThjE8pCYCTexXYGyFjqKVf',
      tokenSymbol: 'ODOP',
    },
    {
      mintAddress: 'dK83wTVypEpa1pqiBbHY3MNuUnT3ADUZM4wk9VZXZEc',
      tokenSymbol: 'AAVE',
    },
    {
      mintAddress: 'A6aY2ceogBz1VaXBxm1j2eJuNZMRqrWUAnKecrMH85zj',
      tokenSymbol: 'LQID',
    },
    {
      mintAddress: '7CnFGR9mZWyAtWxPcVuTewpyC3A3MDW4nLsu5NY6PDbd',
      tokenSymbol: 'SECO',
    },
    {
      mintAddress: '3GECTP7H4Tww3w8jEPJCJtXUtXxiZty31S9szs84CcwQ',
      tokenSymbol: 'HOLY',
    },
    {
      mintAddress: 'DgHK9mfhMtUwwv54GChRrU54T2Em5cuszq2uMuen1ZVE',
      tokenSymbol: 'CEL',
    },
    {
      mintAddress: '7ncCLJpP3MNww17LW8bRvx8odQQnubNtfNZBL5BgAEHW',
      tokenSymbol: 'RSR',
    },
    {
      mintAddress: '5wihEYGca7X4gSe97C5mVcqNsfxBzhdTwpv72HKs25US',
      tokenSymbol: '1INCH',
    },
    {
      mintAddress: '38i2NQxjp5rt5B3KogqrxmBxgrAwaB3W1f1GmiKqh9MS',
      tokenSymbol: 'GRT',
    },
    {
      mintAddress: 'Avz2fmevhhu87WYtWQCFj9UjKRjF9Z9QWwN2ih9yF95G',
      tokenSymbol: 'COMP',
    },
    {
      mintAddress: '9wRD14AhdZ3qV8et3eBQVsrb3UoBZDUbJGyFckpTg8sj',
      tokenSymbol: 'PAXG',
    },
    {
      mintAddress: '6ry4WBDvAwAnrYJVv6MCog4J8zx6S3cPgSqnTsDZ73AR',
      tokenSymbol: 'TRYB',
    },
    {
      mintAddress: 'ASboaJPFtJeCS5eG4gL3Lg95xrTz2UZSLE9sdJtY93kE',
      tokenSymbol: 'DOGEBULL',
    },
    {
      mintAddress: 'Gnhy3boBT4MA8TTjGip5ND2uNsceh1Wgeaw1rYJo51ZY',
      tokenSymbol: 'MAPSPOOL',
    },
    {
      mintAddress: 'MAPS41MDahZ9QdKXhVa4dWB9RuyfV4XqhyAZ8XcYepb',
      tokenSymbol: 'MAPS',
    },
    {
      mintAddress: '9iDWyYZ5VHBCxxmWZogoY3Z6FSbKsX4WFe37c728krdT',
      tokenSymbol: 'OXYPOOL',
    },
    {
      mintAddress: 'D68NB5JkzvyNCZAvi6EGtEcGvSoRNPanU9heYTAUFFRa',
      tokenSymbol: 'PERP',
    },
    {
      mintAddress: '93a1L7xaEV7vZGzNXCcb9ztZedbpKgUiTHYxmFKJwKvc',
      tokenSymbol: 'RAYPOOL',
    },
    {
      mintAddress: '4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R',
      tokenSymbol: 'RAY',
    },
    {
      mintAddress: 'z3dn17yLaGMKffVogeFHQ9zWVcXgqgf3PQnDsNs2g6M',
      tokenSymbol: 'OXY',
    },
    {
      mintAddress: '58UKNpz8UG1erMWdTEvDcezRmcMhmyZtVLTAP2fb5AvK',
      tokenSymbol: 'LIEN',
    },
    {
      mintAddress: '8PMHT4swUMtBzgHnh5U564N5sjPSiUz2cjEQzFnnP1Fo',
      tokenSymbol: 'ROPE',
    },
    {
      mintAddress: 'StepAscQoEioFxxWGnh2sLBDFp9d8rvKz2Yp39iDpyT',
      tokenSymbol: 'STEP',
    },
    {
      mintAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',
      tokenSymbol: 'SAMO',
    },
    {
      mintAddress: 'ETAtLmCmsoiEEKfNrHKJ2kYy3MoABhU6NQvpSfij5tDs',
      tokenSymbol: 'MEDIA',
    },
    {
      mintAddress: 'TuLipcqtGVXP9XR62wM8WWCm6a9vhLs7T1uoWBk6FDs',
      tokenSymbol: 'TULIP',
    },
    {
      mintAddress: 'MERt85fc5boKw3BW1eYdxonEuJNvXbiMbs6hvheau5K',
      tokenSymbol: 'MER',
    },
    {
      mintAddress: '8KK6NLSnfGN87rpM9UNWid2kUjFdYYK6qD1RDNuEhCSb',
      tokenSymbol: 'MERPOOL',
    },
    {
      mintAddress: 'xxxxa1sKNGwFtw2kFn8XauW9xq8hBZ5kVtcSesTT9fW',
      tokenSymbol: 'SLIM',
    },
    {
      mintAddress: 'HEhMLvpSdPviukafKwVN8BnBUTamirptsQ6Wxo5Cyv8s',
      tokenSymbol: 'FTR',
    },
    {
      mintAddress: '4dmKkXNHdgYsXqBHCuMikNQWwVomZURhYvkkX5c4pQ7y',
      tokenSymbol: 'SNY',
    },
    {
      mintAddress: '4wjPQJ6PrkC4dHhYghwJzGBVP78DkBzA2U3kHoFNBuhj',
      tokenSymbol: 'LIQ',
    },
    {
      mintAddress: 'BLwTnYKqf7u4qjgZrrsKeNs2EzWkMLqVCu6j8iHyrNA3',
      tokenSymbol: 'BOP',
    },
    {
      mintAddress: 'E5rk3nmgLUuKUiS94gg4bpWwWwyjCMtddsAXkTFLtHEy',
      tokenSymbol: 'WOO',
    },
    {
      mintAddress: '5p2zjqCd1WJzAVgcEnjhb9zWDU7b9XVhFhx4usiyN7jB',
      tokenSymbol: 'CATO',
    },
    {
      mintAddress: 'EdAhkbj5nF9sRM7XN7ewuW8C9XEUMs8P7cnoQ57SYE96',
      tokenSymbol: 'FAB',
    },
    {
      mintAddress: '32uwQKZibFm5C9EjY6raGC1ZjAAQQWy1LvJxeriJEzEt',
      tokenSymbol: 'DGX',
    },
    {
      mintAddress: '6kwTqmdQkJd8qRr9RjSnUX9XJ24RmJRSrU1rsragP97Y',
      tokenSymbol: 'SAIL',
    },
    {
      mintAddress: '7uv3ZvZcQLd95bUp5WMioxG7tyAZVXFfr8JYkwhMYrnt',
      tokenSymbol: 'BOLE',
    },
    {
      mintAddress: 'GHvFFSZ9BctWsEc5nujR1MTmmJWY7tgQz2AXE6WVFtGN',
      tokenSymbol: 'SOLAPE',
    },
    {
      mintAddress: 'SLRSSpSLUTP7okbCUBYStWCo1vUgyt775faPqz8HUMr',
      tokenSymbol: 'SLRS',
    },
    {
      mintAddress: 'Saber2gLauYim4Mvftnrasomsv6NvAuncvMEZwcLpD1',
      tokenSymbol: 'SBR',
    },
    {
      mintAddress: 'MangoCzJ36AjZyKwVj3VnYU4GTonjfVEnJmvvWaxLac',
      tokenSymbol: 'MNGO',
    },
    {
      mintAddress: 'orcaEKTdK7LKz57vaAYr9QeNsVEPfiu6QeMU1kektZE',
      tokenSymbol: 'ORCA',
    },
    {
      mintAddress: 'PoRTjZMPXb9T7dyU7tpLEZRQj7e6ssfAE62j2oQuc6y',
      tokenSymbol: 'PORT',
    },
    {
      mintAddress: 'GsNzxJfFn6zQdJGeYsupJWzUAm57Ba7335mfhWvFiE9Z',
      tokenSymbol: 'DXL',
    },
    {
      mintAddress: '51tMb3zBKDiQhNwGqpgwbavaGH54mk8fXFzxTc1xnasg',
      tokenSymbol: 'APEX',
    },
    {
      mintAddress: 'DubwWZNWiNGMMeeQHPnMATNj77YZPZSAz2WVR5WjLJqz',
      tokenSymbol: 'CRP',
    },
    {
      mintAddress: 'SUNNYWgPQmFxe9wTZzNK7iPnJ3vYDrkgnxJRJm1s3ag',
      tokenSymbol: 'SUNNY',
    },
    {
      mintAddress: 'ATLASXmbPQxBUYbxPsV97usA3fPQYEqzQBUHgiFCUsXx',
      tokenSymbol: 'ATLAS',
    },
    {
      mintAddress: 'poLisWXnNRwC6oBu1vHiuKQzFjGL4XDSu4g9qjz9qVk',
      tokenSymbol: 'POLIS',
    },
    {
      mintAddress: '3bRTivrVsitbmCTGtqwp7hxXPsybkjn4XLNtPsHqa3zR',
      tokenSymbol: 'LIKE',
    },
    {
      mintAddress: 'BRLsMczKuaR5w9vSubF4j8HwEGGprVAyyVgS4EX7DKEg',
      tokenSymbol: 'CYS',
    },
    {
      mintAddress: '8upjSpvjcdpuzhfR1zriwg5NXkwDruejqNE9WNbPRtyA',
      tokenSymbol: 'GRAPE',
    },
    {
      mintAddress: 'PRT88RkA4Kg5z7pKnezeNH4mafTvtQdfFgpQTGRjz44',
      tokenSymbol: 'PRT',
    },
    {
      mintAddress: '8RYSc3rrS4X4bvBCtSJnhcpPpMaAJkXnVKZPzANxQHgz',
      tokenSymbol: 'YARD',
    },
    {
      mintAddress: 'Gsai2KN28MTGcSZ1gKYFswUpFpS7EM9mvdR9c8f6iVXJ',
      tokenSymbol: 'gSAIL',
    },
    {
      mintAddress: 'Ce3PSQfkxT5ua4r2JqCoWYrMwKWC5hEzwsrT9Hb7mAz9',
      tokenSymbol: 'DATE',
    },
    {
      mintAddress: 'AMdnw9H5DFtQwZowVFr4kUgSXJzLokKSinvgGiUoLSps',
      tokenSymbol: 'MOLA',
    },
    {
      tokenSymbol: 'LARIX',
      mintAddress: 'Lrxqnh6ZHKbGy3dcrCED43nsoLkM1LTzU2jRfWe8qUC',
    },
    {
      tokenSymbol: 'SYP',
      mintAddress: 'FnKE9n6aGjQoNWRBZXy4RW6LZVao7qwBonUbiD7edUmZ',
    },
    {
      tokenSymbol: 'SWAN',
      mintAddress: 'SWANaZUGxF82KyVsbxeeNsMaVECtimze5VyCdywkvkH',
    },
    {
      tokenSymbol: 'ACMN',
      mintAddress: '9MhNoxy1PbmEazjPo9kiZPCcG7BiFbhi3bWZXZgacfpp',
    },
    {
      tokenSymbol: 'TOX',
      mintAddress: 'EKSKqHA5jN6XvcRLMVvQBVGnbCHuSM2cxtMXeAHUETV7',
    },
    {
      tokenSymbol: 'KEKW',
      mintAddress: '2QK9vxydd7WoDwvVFT5JSU8cwE9xmbJSzeqbRESiPGMG',
    },
    {
      tokenSymbol: 'SPWN',
      mintAddress: '5U9QqCPhqXAJcEv9uyzFJd5zhN93vuPk1aNNkXnUfPnt',
    },
    {
      tokenSymbol: 'CHEEMS',
      mintAddress: '3FoUAsGDbvTD6YZ4wVKJgTB76onJUKz7GPEBNiR5b8wc',
    },
    {
      tokenSymbol: 'MIM',
      mintAddress: '4dydh8EGNEdTz6grqnGBxpduRg55eLnwNZXoNZJetadu',
    },
    {
      tokenSymbol: 'KURO',
      mintAddress: '2Kc38rfQ49DFaKHQaWbijkE7fcymUMLY5guUiUsDmFfn',
    },
    {
      tokenSymbol: 'NINJA',
      mintAddress: 'FgX1WD9WzMU3yLwXaFSarPfkgzjLb2DZCqmkx9ExpuvJ',
    },
    {
      tokenSymbol: 'ABR',
      mintAddress: 'a11bdAAuV8iB2fu7X6AxAvDTo1QZ8FXB3kk5eecdasp',
    },
    {
      tokenSymbol: 'COBAN',
      mintAddress: '7udMmYXh6cuWVY6qQVCd9b429wDVn2J71r5BdxHkQADY',
    },
    {
      tokenSymbol: 'CRY',
      mintAddress: 'HbrmyoumgcK6sDFBi6EZQDi4i4ZgoN16eRB2JseKc7Hi',
    },
    {
      tokenSymbol: 'SFCN',
      mintAddress: '5abCYCzwJLtazvtAZEPcHaEoB2zZ6xNFEmM36o6qyAHy',
    },
    {
      tokenSymbol: 'CHIH',
      mintAddress: '6xtyNYX6Rf4Kp3629X11m1jqUmkV89mf9xQakUtUQfHq',
    },
    {
      tokenSymbol: 'SOLA',
      mintAddress: 'FYfQ9uaRaYvRiaEGUmct45F9WKam3BYXArTrotnTNFXF',
    },
    {
      tokenSymbol: 'ALM',
      mintAddress: 'ALMmmmbt5KNrPPUBFE4dAKUKSPWTop5s3kUGCdF69gmw',
    },
    {
      tokenSymbol: 'SOB',
      mintAddress: 'EkDf4Nt89x4Usnxkj4sGHX7sWxkmmpiBzA4qdDkgEN6b',
    },
    {
      tokenSymbol: 'FRIES',
      mintAddress: 'FriCEbw1V99GwrJRXPnSQ6su2TabHabNxiZ3VNsVFPPN',
    },
    {
      tokenSymbol: 'mSOL',
      mintAddress: 'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So',
    },
    {
      tokenSymbol: 'MNDE',
      mintAddress: 'MNDEFzGvMt87ueuHvVU9VcTqsAP5b3fTGPsHuuPA5ey',
    },
    {
      tokenSymbol: 'HAMS',
      mintAddress: 'A2T2jDe2bxyEHkKtS8AtrTRmJ9VZRwyY8Kr7oQ8xNyfb',
    },
    {
      tokenSymbol: 'BST',
      mintAddress: 'EYDEQW4xQzLqHcFwHTgGvpdjsa5EFn74KzuqLX5emjD2',
    },
    {
      tokenSymbol: 'IVN',
      mintAddress: 'iVNcrNE9BRZBC9Aqf753iZiZfbszeAVUoikgT9yvr2a',
    },
    {
      tokenSymbol: 'SLX',
      mintAddress: 'AASdD9rAefJ4PP7iM89MYUsQEyCQwvBofhceZUGDh5HZ',
    },
    {
      tokenSymbol: 'JET',
      mintAddress: 'JET6zMJWkCN9tpRT2v2jfAmm5VnQFDpUBCyaKojmGtz',
    },
    {
      tokenSymbol: 'PLEB',
      mintAddress: '2hWrFTaGYXNLEVnTdvYPF5roxp4NSygoC8BYWYHYLuXd',
    },
    {
      tokenSymbol: 'WOOF',
      mintAddress: '9nEqaUcb16sQ3Tn1psbkWqyhPdLmfHWjKGymREjsAgTE',
    },
    {
      tokenSymbol: 'ASH',
      mintAddress: 'FY6XDSCubMhpkU9FAsUjB7jmN8YHYZGezHTWo9RHBSyX',
    },
    {
      tokenSymbol: 'LIZARD',
      mintAddress: '5ENUvV3Ur3o3Fg6LVRfHL4sowidiVTMHHsEFqNJXRz6o',
    },
    {
      tokenSymbol: 'PGNT',
      mintAddress: 'BxHJqGtC629c55swCqWXFGA2rRF1igbbTmh22H8ePUWG',
    },
    {
      tokenSymbol: 'INU',
      mintAddress: '5jFnsfx36DyGk8uVGrbXnVUMTsBkPXGpx6e69BiGFzko',
    },
    {
      tokenSymbol: 'SHBL',
      mintAddress: '7fCzz6ZDHm4UWC9Se1RPLmiyeuQ6kStxpcAP696EuE1E',
    },
    {
      tokenSymbol: 'SOLJAV',
      mintAddress: 'Dypr2gWcVuqt3z6Uh31YD8Wm2V2ZCqWVBYEWhZNF9odk',
    },
    {
      tokenSymbol: 'BORK',
      mintAddress: '2LxZrcJJhzcAju1FBHuGvw929EVkX7R7Q8yA2cdp8q7b',
    },
    {
      tokenSymbol: 'DEGN',
      mintAddress: 'A9UhP1xfQHWUhSd54NgKPub2XB3ZuQMdPEvf9aMTHxGT',
    },
    {
      tokenSymbol: 'PIZZLY',
      mintAddress: 'AThqqJBiMPUFQvV2f3mpc4RYdncEjkw1TX3bwqHuJrUn',
    },
    {
      tokenSymbol: 'FLOOF',
      mintAddress: '3jzdrXXKxwkBk82u2eCWASZLCKoZs1LQTg87HBEAmBJw',
    },
    {
      tokenSymbol: 'LEONIDAS',
      mintAddress: '7puG5H5Mc6QpvaXjAVLr6GnL5hhUMnpLcUm8G3mEsgHQ',
    },
    {
      tokenSymbol: 'SOLBERRY',
      mintAddress: 'EWS2ATMt5fQk89NWLJYNRmGaNoji8MhFZkUB4DiWCCcz',
    },
    {
      tokenSymbol: 'BIP',
      mintAddress: 'FoqP7aTaibT5npFKYKQQdyonL99vkW8YALNPwWepdvf5',
    },
    {
      tokenSymbol: 'OOGI',
      mintAddress: 'H7Qc9APCWWGDVxGD5fJHmLTmdEgT9GFatAKFNg6sHh8A',
    },
    {
      tokenSymbol: 'DINO',
      mintAddress: '6Y7LbYB3tfGBG6CSkyssoxdtHb77AEMTRVXe8JUJRwZ7',
    },
    {
      tokenSymbol: 'SDOGE',
      mintAddress: '8ymi88q5DtmdNTn2sPRNFkvMkszMHuLJ1e3RVdWjPa3s',
    },
    {
      tokenSymbol: 'BMBO',
      mintAddress: '5sM9xxcBTM9rWza6nEgq2cShA87JjTBx1Cu82LjgmaEg',
    },
    {
      tokenSymbol: 'SBULL',
      mintAddress: '3xVf2hPbkE5TuZNUPLQXFgFLD4LpvCM45BodbPmnpSSV',
    },
    {
      tokenSymbol: 'SPKL',
      mintAddress: '31tCNEE6LiL9yW4Bu153Dq4vi2GuorXxCA9pW9aA6ecU',
    },
    {
      tokenSymbol: 'SHIBL',
      mintAddress: 'AsVNhq2nnoUgMWciCvePRyHk7xAv6i4ruV6oRHFWBcwF',
    },
    {
      tokenSymbol: 'CAVE',
      mintAddress: '4SZjjNABoqhbd4hnapbvoEPEqT8mnNkfbEoAwALf1V8t',
    },
    {
      tokenSymbol: 'BABY',
      mintAddress: 'Uuc6hiKT9Y6ASoqs2phonGGw2LAtecfJu9yEohppzWH',
    },
    {
      tokenSymbol: 'SLND',
      mintAddress: 'SLNDpmoWTVADgEdndyvWzroNL7zSi1dF9PC3xHGtPwp',
    },
    {
      tokenSymbol: 'SPX',
      mintAddress: 'H6JocWxg5g1Lcs4oPnBecmjQ4Y1bkZhGJHtjMunmjyrp',
    },
    {
      tokenSymbol: 'SAO',
      mintAddress: '2HeykdKjzHKGm2LKHw8pDYwjKPiFEoXAz74dirhUgQvq',
    },
    {
      tokenSymbol: 'WIPE',
      mintAddress: '9ae76zqD3cgzR9gvf5Thc2NN3ACF7rqqnrLqxNzgcre6',
    },
    {
      tokenSymbol: 'OTR',
      mintAddress: '6TgvYd7eApfcZ7K5Mur7MaUQ2xT7THB4cLHWuMkQdU5Z',
    },
    {
      tokenSymbol: 'FUM',
      mintAddress: 'EZF2sPJRe26e8iyXaCrmEefrGVBkqqNGv9UPGG9EnTQz',
    },
    {
      tokenSymbol: 'GMCOIN',
      mintAddress: 'A9Nc6Yo9YGKsaeAb2nsQFSQpLcdotGqjEJmEQFzZeeqX',
    },
    {
      tokenSymbol: 'ASTRA',
      mintAddress: 'AMp8Jo18ZjK2tuQGfjKAkkWnVP4NWX5sav4NJH6pXF2D',
    },
    {
      mintAddress: '91z91RukFM16hyEUCXuwMQwp2BW3vanNG5Jh5yj6auiJ',
      tokenSymbol: 'BVOL',
    },
    {
      mintAddress: '5TY71D29Cyuk9UrsSxLXw2quJBpS7xDDFuFu2K9W7Wf9',
      tokenSymbol: 'IBVOL',
    },
    {
      mintAddress: '5ddiFxh3J2tcZHfn8uhGRYqu16P3FUvBfh8WoZPUHKW5',
      tokenSymbol: 'EOSBEAR',
    },
    {
      mintAddress: 'qxxF6S62hmZF5bo46mS7C2qbBa87qRossAM78VzsDqi',
      tokenSymbol: 'EOSBULL',
    },
    {
      mintAddress: '2CDLbxeuqkLTLY3em6FFQgfBQV5LRnEsJJgcFCvWKNcS',
      tokenSymbol: 'BNBBEAR',
    },
    {
      mintAddress: 'AfjHjdLibuXyvmz7PyTSc5KEcGBh43Kcu8Sr2tyDaJyt',
      tokenSymbol: 'BNBBULL',
    },
    {
      mintAddress: '8kA1WJKoLTxtACNPkvW6UNufsrpxUY57tXZ9KmG9123t',
      tokenSymbol: 'BSVBULL',
    },
    {
      mintAddress: '2FGW8BVMu1EHsz2ZS9rZummDaq6o2DVrZZPw4KaAvDWh',
      tokenSymbol: 'BSVBEAR',
    },
    {
      mintAddress: '8L9XGTMzcqS9p61zsR35t7qipwAXMYkD6disWoDFZiFT',
      tokenSymbol: 'LTCBEAR',
    },
    {
      mintAddress: '863ZRjf1J8AaVuCqypAdm5ktVyGYDiBTvD1MNHKrwyjp',
      tokenSymbol: 'LTCBULL',
    },
    {
      mintAddress: 'GkSPaHdY2raetuYzsJYacHtrAtQUfWt64bpd1VzxJgSD',
      tokenSymbol: 'BULL',
    },
    {
      mintAddress: '45vwTZSDFBiqCMRdtK4xiLCHEov8LJRW8GwnofG8HYyH',
      tokenSymbol: 'BEAR',
    },
    {
      mintAddress: '2VTAVf1YCwamD3ALMdYHRMV5vPUCXdnatJH5f1khbmx6',
      tokenSymbol: 'BCHBEAR',
    },
    {
      mintAddress: '22xoSp66BDt4x4Q5xqxjaSnirdEyharoBziSFChkLFLy',
      tokenSymbol: 'BCHBULL',
    },
    {
      mintAddress: 'CwChm6p9Q3yFrjzVeiLTTbsoJkooscof5SJYZc2CrNqG',
      tokenSymbol: 'ETHBULL',
    },
    {
      mintAddress: 'Bvv9xLodFrvDFSno9Ud8SEh5zVtBDQQjnBty2SgMcJ2s',
      tokenSymbol: 'ETHBEAR',
    },
    {
      mintAddress: 'HRhaNssoyv5tKFRcbPg69ULEbcD8DPv99GdXLcdkgc1A',
      tokenSymbol: 'ALTBULL',
    },
    {
      mintAddress: '9Mu1KmjBKTUWgpDoeTJ5oD7XFQmEiZxzspEd3TZGkavx',
      tokenSymbol: 'ALTBEAR',
    },
    {
      mintAddress: 'AYL1adismZ1U9pTuN33ahG4aYc5XTZQL4vKFx9ofsGWD',
      tokenSymbol: 'BULLSHIT',
    },
    {
      mintAddress: '5jqymuoXXVcUuJKrf1MWiHSqHyg2osMaJGVy69NsJWyP',
      tokenSymbol: 'BEARSHIT',
    },
    {
      mintAddress: 'EL1aDTnLKjf4SaGpqtxJPyK94imSBr8fWDbcXjXQrsmj',
      tokenSymbol: 'MIDBULL',
    },
    {
      mintAddress: '2EPvVjHusU3ozoucmdhhnqv3HQtBsQmjTnSa87K91HkC',
      tokenSymbol: 'MIDBEAR',
    },
    {
      mintAddress: '8TCfJTyeqNBZqyDMY4VwDY7kdCCY7pcbJJ58CnKHkMu2',
      tokenSymbol: 'LINKBEAR',
    },
    {
      mintAddress: 'EsUoZMbACNMppdqdmuLCFLet8VXxt2h47N9jHCKwyaPz',
      tokenSymbol: 'LINKBULL',
    },
    {
      mintAddress: '262cQHT3soHwzuo2oVSy5kAfHcFZ1Jjn8C1GRLcQNKA3',
      tokenSymbol: 'XRPBULL',
    },
    {
      mintAddress: '8sxtSswmQ7Lcd2GjK6am37Z61wJZjA2SzE7Luf7yaKBB',
      tokenSymbol: 'XRPBEAR',
    },
  ],
};
