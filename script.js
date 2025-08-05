document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');

    const form = document.getElementById('drug-form');
    const drugNameInput = document.getElementById('drug-name');
    const opeDayInput = document.getElementById('ope-day');
    const resultsList = document.getElementById('results-list');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        console.log('Form submitted');

        const drugName = drugNameInput.value;
        const opeDay = opeDayInput.value;

        console.log('Drug Name:', drugName);
        console.log('Operation Day:', opeDay);

        if (!drugName || !opeDay) {
            alert('薬剤名と手術日を入力してください。');
            return;
        }

        const apiUrl = 'https://api.dify.ai/v1/workflows/run'; // https://api.dify.ai/v1/workflows/run
        const apiKey = 'app-NYwepc1jgrbWkVnhhq7skjcj';

        const data = {
            inputs: {
                drug_name: drugName,
                ope_day: opeDay.replace(/-/g, '/') // yyyy-mm-dd to yyyy/mm/dd
            },
            response_mode: 'blocking',
            user: `user-${Date.now()}` // Unique user ID for each request
        };

        console.log('Sending data to Dify:', JSON.stringify(data, null, 2));

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            console.log('Received response from Dify:', response);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API Error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const result = await response.json();
            console.log('Parsed Dify result:', result);

            // Difyのレスポンス構造に合わせてtextプロパティを取得
            const resultText = result?.data?.text || '結果がありませんでした。';

            const newListItem = document.createElement('li');
            newListItem.textContent = resultText;
            resultsList.appendChild(newListItem);

            // Clear input fields after successful submission
            drugNameInput.value = '';
            opeDayInput.value = '';

        } catch (error) {
            console.error('Error fetching data from Dify:', error);
            alert(`エラーが発生しました。
${error.message}`);
            const errorListItem = document.createElement('li');
            errorListItem.textContent = `エラー: ${error.message}`;
            errorListItem.style.color = 'red';
            resultsList.appendChild(errorListItem);
        }
    });
});
