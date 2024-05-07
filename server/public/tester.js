document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('pokemonForm');
    const notifier = document.getElementById('notifier');

    const displayNotification = (message, isError = false) => {
        notifier.textContent = message;
        notifier.className = `notification ${isError ? 'is-danger' : 'is-success'}`;
        setTimeout(() => {
            notifier.textContent = '';
        }, 3000);
    };

    const handleFormSubmit = async (method, url, body) => {
        try {
            const response = await fetch(`http://localhost:8080${url}`, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();
            console.log(data);
            displayNotification('Operation successful', false);
        } catch (error) {
            console.error('Error:', error);
            displayNotification('Operation failed', true);
        }
    };

    const getFormData = () => ({
        name: {
            english: form.elements.nameEnglish.value,
            french: form.elements.nameFrench.value
        },
        type: form.elements.type.value.split(','),
        base: {
            HP: parseInt(form.elements.baseHP.value),
            Attack: parseInt(form.elements.baseAttack.value),
            Defense: parseInt(form.elements.baseDefense.value),
            'Sp. Attack': parseInt(form.elements.baseSpAttack.value),
            'Sp. Defense': parseInt(form.elements.baseSpDefense.value),
            Speed: parseInt(form.elements.baseSpeed.value)
        }
    });

    const handleClick = async (method, url) => {
        const id = form.elements.id.value;
        const body = method !== 'DELETE' ? getFormData() : undefined;
        await handleFormSubmit(method, `/api/pokemon${url}`, body);
    };

    document.getElementById('btnInsert').addEventListener('click', async () => handleClick('POST', ''));
    document.getElementById('btnUpdate').addEventListener('click', async () => handleClick('PUT', `/${form.elements.id.value}`));
    document.getElementById('btnDelete').addEventListener('click', async () => handleClick('DELETE', `/${form.elements.id.value}`));
});
