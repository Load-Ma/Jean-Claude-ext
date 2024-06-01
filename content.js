console.log("Content script loaded");

const subtitles = [];

// Fonction pour obtenir l'horodatage actuel
function getCurrentTimestamp() {
    return new Date().toLocaleTimeString();
}

// Fonction pour surveiller les sous-titres
function observeSubtitles() {
    const subtitleContainer = document.querySelector('.TBMuR'); // Remplacez par le sélecteur réel

    if (subtitleContainer) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            let subtitleText = node.innerText.trim() + ' '
                            const speakerName = node.querySelector('.zs7s8d'); // Remplacez par le sélecteur réel
                            const timestamp = getCurrentTimestamp();

                            subtitles.push({speaker: speakerName, text: subtitleText, time: timestamp});
                        }
                    });
                }
            });
        });

        observer.observe(subtitleContainer, {childList: true, subtree: true});
    } else {
        setTimeout(() => observeSubtitles(), 500);
        console.error('Subtitle container not found');
    }
}

// Appeler la fonction pour commencer à observer
observeSubtitles();

// Écouter les messages pour déclencher le téléchargement
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Message received in content script:', request);

    if (request.action === 'downloadSubtitles') {
        const subtitleText = subtitles.map(sub => `${sub.time} - ${sub.speaker}: ${sub.text}`).join('\n');
        console.log('Subtitles:', subtitleText); // Ajoutez ce log pour vérifier le contenu des sous-titres
        sendResponse({status: 'success', data: subtitleText});
        console.log('Subtitles sent to popup');
    }
});


// <div className="TBMuR bj4p3b" style="">
//     <div><img alt="" className="KpxDtd r6DyN"
//               src="https://lh3.googleusercontent.com/a/ACg8ocKaYNx4tIydM59LgLaiA0mmQsSIR2aJFYvdzlqIzzqCp4fNxts=s50-p-k-no-mo"
//               data-iml="28947"/>
//         <div className="zs7s8d jxFHg">Vous</div>
//     </div>
//     <div jsname="YSxPC" className="Mz6pEf wY1pdd" style="height: 118.4px;">
//         <div jsname="tgaKEf" className="iTTPOb VbkSUe" style="text-indent: 598.263px;"><span>histoire un moment donné la même </span><span>qualité </span><span>moi ce que vous faites de me dire une </span><span>solution pour repartir en question. </span><span>questionnement </span><span>tu vois, c'est un </span><span>Si tous les questions en fait à se </span><span>poser du coup, on s'arrête pas, on </span><span>s'arrête pas. </span>
//         </div>
//     </div>
// </div>