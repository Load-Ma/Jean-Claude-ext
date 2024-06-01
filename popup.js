document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('download').addEventListener('click', () => {
        console.log('Download button clicked');

        chrome.tabs.query({active: true, currentWindow: true}, tabs => {
            const activeTab = tabs[0];
            console.log('Active tab:', activeTab);

            if (!activeTab || !activeTab.id) {
                console.error('No active tab or tab ID found');
                return;
            }

            chrome.tabs.sendMessage(activeTab.id, {action: 'downloadSubtitles'}, response => {
                console.log('Message sent to content script');

                if (chrome.runtime.lastError) {
                    console.error('Error:', chrome.runtime.lastError.message);
                } else {
                    console.log('Response from content script:', response);

                    if (response.status === 'success') {
                        const subtitleText = response.data;
                        const blob = new Blob([subtitleText], {type: 'text/plain'});
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'subtitles.txt';
                        a.click();
                        URL.revokeObjectURL(url);
                    }
                }
            });
        });
    });
});
