document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('canvas');
    const addInstanceBtn = document.getElementById('addInstanceBtn');
    const snapInstancesBtn = document.getElementById('snapInstancesBtn');
    let instanceCount = 0;

    const themes = [
        'White', 'Gray', 'Black', 'Brown', 'Red', 'Orange', 'Yellow', 'Green', 'Blue', 'Indigo', 'Violet', 'Pink'
    ];

    addInstanceBtn.addEventListener('click', () => addInstance());
    snapInstancesBtn.addEventListener('click', () => snapAllInstances());

    function addInstance() {
        const instance = document.createElement('div');
        instance.classList.add('instance');

        instance.innerHTML = `
            <button class="close-btn">X</button>
            <input type="text" placeholder="Name:" class="name-input">
            <div class="row">
                <div class="cell"><input type="text" placeholder="STR"></div>
                <div class="cell"><input type="text" placeholder="DEX"></div>
                <div class="cell"><input type="text" placeholder="CON"></div>
                <div class="cell"><input type="text" placeholder="INT"></div>
                <div class="cell"><input type="text" placeholder="WIS"></div>
                <div class="cell"><input type="text" placeholder="CHA"></div>
            </div>
            <div class="row">
                <div class="cell"><input type="number" class="numeric-spinner" min="0" max="99"></div>
                <div class="cell"><input type="number" class="numeric-spinner" min="0" max="99"></div>
                <div class="cell"><input type="number" class="numeric-spinner" min="0" max="99"></div>
                <div class="cell"><input type="number" class="numeric-spinner" min="0" max="99"></div>
                <div class="cell"><input type="number" class="numeric-spinner" min="0" max="99"></div>
                <div class="cell"><input type="number" class="numeric-spinner" min="0" max="99"></div>
            </div>
            <div class="row">
                <div class="cell"><input type="text" placeholder="HP"></div>
                <div class="cell"><input type="text" placeholder="AC"></div>
                <div class="cell"><input type="text" placeholder="DC"></div>
                <div class="cell"><input type="text" placeholder="PP"></div>
                <div class="cell"><input type="text" placeholder="Ammo"></div>
                <div class="cell"><input type="text" placeholder="Charge"></div>
            </div>
            <div class="row">
                <div class="cell"><input type="number" class="numeric-spinner" min="0" max="99"></div>
                <div class="cell"><input type="number" class="numeric-spinner" min="0" max="99"></div>
                <div class="cell"><input type="number" class="numeric-spinner" min="0" max="99"></div>
                <div class="cell"><input type="number" class="numeric-spinner" min="0" max="99"></div>
                <div class="cell"><input type="number" class="numeric-spinner" min="0" max="99"></div>
                <div class="cell"><input type="number" class="numeric-spinner" min="0" max="99"></div>
            </div>
            <table class="collapsible">
                <thead>
                    <tr>
                        <th>1</th>
                        <th>2</th>
                        <th>3</th>
                        <th>4</th>
                        <th>5</th>
                        <th>6</th>
                        <th>7</th>
                        <th>8</th>
                        <th>9</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><input type="number" class="numeric-spinner" min="0" max="99"></td>
                        <td><input type="number" class="numeric-spinner" min="0" max="99"></td>
                        <td><input type="number" class="numeric-spinner" min="0" max="99"></td>
                        <td><input type="number" class="numeric-spinner" min="0" max="99"></td>
                        <td><input type="number" class="numeric-spinner" min="0" max="99"></td>
                        <td><input type="number" class="numeric-spinner" min="0" max="99"></td>
                        <td><input type="number" class="numeric-spinner" min="0" max="99"></td>
                        <td><input type="number" class="numeric-spinner" min="0" max="99"></td>
                        <td><input type="number" class="numeric-spinner" min="0" max="99"></td>
                    </tr>
                </tbody>
            </table>
            <div class="theme-menu">
                <select class="theme-selector">
                    ${themes.map(theme => `<option value="${theme}">${theme}</option>`).join('')}
                </select>
                <button class="cycle-theme-btn">Cycle</button>
            </div>
            <button class="generate-btn">Generate</button>
            <button class="reset-btn">Reset</button>
            <textarea class="actions" placeholder="Actions:"></textarea>
            <textarea class="spells" placeholder="Spells:"></textarea>
            <textarea class="inventory" placeholder="Inventory:"></textarea>
            <textarea class="notes" placeholder="Notes:"></textarea>
        `;

        instance.querySelector('.close-btn').addEventListener('click', () => {
            canvas.removeChild(instance);
            instanceCount--;
            snapAllInstances(); // Re-snap instances after removal
        });
        instance.querySelector('.generate-btn').addEventListener('click', () => generateValues(instance));
        instance.querySelector('.reset-btn').addEventListener('click', () => resetValues(instance));
        instance.querySelector('.cycle-theme-btn').addEventListener('click', () => cycleTheme(instance));
        instance.querySelector('.theme-selector').addEventListener('change', (e) => applyTheme(instance, e.target.value));

        canvas.appendChild(instance);
        instanceCount++;
        snapAllInstances(); // Ensure the new instance is added to the correct spot
    }

    function snapAllInstances() {
        const instances = document.querySelectorAll('.instance');
        instances.forEach((instance, index) => {
            const row = Math.floor(index / 4); // Adjusted for rows with fewer than 5 cells
            const col = index % 4; // Adjusted for rows with fewer than 5 cells
            const snappedPos = {
                left: 10 + col * (instance.offsetWidth + 10),
                top: 10 + row * (instance.offsetHeight + 10)
            };
            instance.style.top = `${snappedPos.top}px`;
            instance.style.left = `${snappedPos.left}px`;
            instance.style.position = "absolute";
        });
    }

    function generateValues(instance) {
        const numericInputs = instance.querySelectorAll('.row:nth-of-type(2) .numeric-spinner');
        numericInputs.forEach(input => {
            const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
            const dropped = Math.min(...rolls);
            const usedRolls = rolls.filter(roll => roll !== dropped);
            const sum = usedRolls.reduce((a, b) => a + b, 0) + dropped; // Include the dropped value in the sum
            input.value = sum;
            input.title = `${rolls.join(', ')} (dropped: ${dropped})`;
        });
    }

    function resetValues(instance) {
        const textInputs = instance.querySelectorAll('input[type="text"]');
        const numberInputs = instance.querySelectorAll('input[type="number"]');
        const textareas = instance.querySelectorAll('textarea');

        textInputs.forEach(input => input.value = '');
        numberInputs.forEach(input => input.value = '');
        textareas.forEach(textarea => textarea.value = '');
    }

    function applyTheme(instance, theme) {
        instance.className = `instance ${theme.toLowerCase()}`;
    }

    function cycleTheme(instance) {
        const currentTheme = instance.querySelector('.theme-selector').value;
        const currentIndex = themes.indexOf(currentTheme);
        const nextIndex = (currentIndex + 1) % themes.length;
        const nextTheme = themes[nextIndex];

        instance.querySelector('.theme-selector').value = nextTheme;
        applyTheme(instance, nextTheme);
    }

    addInstance(); // Load one instance on start
});
