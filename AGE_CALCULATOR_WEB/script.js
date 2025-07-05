document.getElementById('calculate-btn').addEventListener('click', function() {
    const birthdate = document.getElementById('birthdate').value;
    if (birthdate === '') {
        alert('Please enter your birthdate');
        return;
    }

    const today = new Date();
    const birthdateObj = new Date(birthdate);
    const age = today.getFullYear() - birthdateObj.getFullYear();
    const monthDiff = today.getMonth() - birthdateObj.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdateObj.getDate())) {
        age--;
    }

    const resultContainer = document.getElementById('result');
    resultContainer.textContent = `You are ${age} years old.`;
    resultContainer.style.display = 'block';

    resultContainer.classList.add('fade-in');
    setTimeout(() => {
        resultContainer.classList.remove('fade-in');
    }, 1000);
});
