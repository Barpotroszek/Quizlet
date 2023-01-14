# Quizlet

## Szybka instrukcja:
---
1. Utwórz w repozytorium nową gałąź i nazwij ją jakoś adekwatnie
2. Wejdź na danego quizleta
3. Otwórz narzędzia dewelopera(**Zbadaj stronę** -> **Konsola**)
4. Wklej do konsoli ten kod: 
```js
JSON.stringify((function toPasteInBrowser(){
    let fishki = document.querySelectorAll('.SetPageTerm-content'), data=[], elem;
    fishki.forEach((fiszka)=>{
        elem = {};
        elem.eng = fiszka.querySelector('.lang-en').textContent;
        elem.pl=fiszka.querySelector('.lang-pl').textContent;
        data.push(elem);
    })
    return data;
})())
```
5. W odpowiedzi dostaniesz stringa ze wszystkimi słówkami, które można znaleźć na danym quizlecie. Wklej go do pliku ***output.json*** i usuń z początku i końca apostrofy
6. Opublikuj te zmiany i zmień w ustawieniach repozytorium, by udostępniało właściwą gałąź

### ***Miłej Nauki :>***