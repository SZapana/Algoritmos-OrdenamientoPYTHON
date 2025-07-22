// Configuración inicial
document.addEventListener('DOMContentLoaded', function() {
    // Actualizar valor del slider
    const arraySize = document.getElementById('arraySize');
    const sizeValue = document.getElementById('sizeValue');
    
    arraySize.addEventListener('input', function() {
        sizeValue.textContent = `${this.value} elementos`;
        document.getElementById('currentSize').textContent = this.value;
    });
    
    // Inicializar gráfico
    const ctx = document.getElementById('timeChart').getContext('2d');
    let timeChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Tiempo de ejecución (ms)',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.7)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#ecf0f1'
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#ecf0f1'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ecf0f1'
                    }
                }
            }
        }
    });
    
    // Ejecutar comparación
    document.getElementById('executeBtn').addEventListener('click', function() {
        const btn = this;
        const originalText = btn.innerHTML;
        
        // Mostrar estado de carga
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        btn.disabled = true;
        
        // Obtener parámetros
        const size = parseInt(arraySize.value);
        const arrayType = document.getElementById('arrayType').value;
        const algorithms = [...document.querySelectorAll('input[name="algorithm"]:checked')].map(cb => cb.value);
        
        // Enviar solicitud al backend
        fetch('/run-comparison', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                size: size,
                arrayType: arrayType,
                algorithms: algorithms
            })
        })
        .then(response => response.json())
        .then(data => {
            // Actualizar gráfico
            timeChart.data.labels = [];
            timeChart.data.datasets[0].data = [];
            
            let minTime = Infinity;
            let fastestAlgo = '';
            
            for (const algo in data) {
                const algoName = getAlgorithmName(algo);
                timeChart.data.labels.push(algoName);
                timeChart.data.datasets[0].data.push(data[algo]);
                
                if (data[algo] < minTime) {
                    minTime = data[algo];
                    fastestAlgo = algoName;
                }
            }
            
            timeChart.update();
            
            // Actualizar estadísticas
            document.getElementById('bestTime').textContent = minTime.toFixed(2) + ' ms';
            document.getElementById('fastestAlgo').textContent = fastestAlgo;
            
            // Restaurar botón
            btn.innerHTML = originalText;
            btn.disabled = false;
        })
        .catch(error => {
            console.error('Error:', error);
            btn.innerHTML = originalText;
            btn.disabled = false;
            alert('Ocurrió un error al ejecutar la comparación');
        });
    });
    
    // Simulación en vivo
    const simulationSize = document.getElementById('simulationSize');
    const simulationSizeValue = document.getElementById('simulationSizeValue');
    const simulationSpeed = document.getElementById('simulationSpeed');
    const simulationSpeedValue = document.getElementById('simulationSpeedValue');
    
    simulationSize.addEventListener('input', function() {
        simulationSizeValue.textContent = `${this.value} elementos`;
    });
    
    simulationSpeed.addEventListener('input', function() {
        const speeds = ['Muy lenta', 'Lenta', 'Media', 'Rápida', 'Muy rápida'];
        simulationSpeedValue.textContent = speeds[this.value - 1];
    });
    
    document.getElementById('startSimulation').addEventListener('click', function() {
        const size = parseInt(simulationSize.value);
        const speed = parseInt(simulationSpeed.value);
        const algorithm = document.getElementById('simulationAlgorithm').value;
        
        // Generar arreglo aleatorio
        const arr = generateRandomArray(size, 1, 100);
        
        // Visualizar arreglo inicial
        visualizeArray(arr);
        
        // Ejecutar simulación según el algoritmo seleccionado
        switch(algorithm) {
            case 'bubble':
                bubbleSortSimulation(arr, speed);
                break;
            case 'insertion':
                insertionSortSimulation(arr, speed);
                break;
            case 'selection':
                selectionSortSimulation(arr, speed);
                break;
            case 'merge':
                mergeSortSimulation(arr, speed);
                break;
            case 'quick':
                quickSortSimulation(arr, speed);
                break;
        }
    });
    
    // Copiar código
    document.querySelector('.copy-btn').addEventListener('click', function() {
        const code = document.getElementById('algorithmCode').textContent;
        navigator.clipboard.writeText(code);
        
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Copiado!';
        
        setTimeout(() => {
            this.innerHTML = originalText;
        }, 2000);
    });
    
    // Obtener información del algoritmo al hacer clic en la barra
    document.querySelectorAll('input[name="algorithm"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.checked) {
                fetch(`/get-algorithm-info/${this.value}`)
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById('algorithmCode').textContent = data.code;
                    });
            }
        });
    });
    
    // Inicializar con Bubble Sort
    fetch('/get-algorithm-info/bubble')
        .then(response => response.json())
        .then(data => {
            document.getElementById('algorithmCode').textContent = data.code;
        });
});

// Funciones de utilidad
function getAlgorithmName(key) {
    const names = {
        'bubble': 'Bubble Sort',
        'insertion': 'Insertion Sort',
        'selection': 'Selection Sort',
        'merge': 'Merge Sort',
        'quick': 'Quick Sort'
    };
    return names[key] || key;
}

function generateRandomArray(size, min, max) {
    return Array.from({length: size}, () => Math.floor(Math.random() * (max - min + 1)) + min);
}

function visualizeArray(arr, activeIndex = -1, sortedIndices = []) {
    const container = document.getElementById('arrayVisualization');
    container.innerHTML = '';
    
    const maxVal = Math.max(...arr);
    const containerHeight = 300;
    
    arr.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${(value / maxVal) * 100}%`;
        
        if (index === activeIndex) {
            bar.classList.add('active');
        }
        
        if (sortedIndices.includes(index)) {
            bar.classList.add('sorted');
        }
        
        container.appendChild(bar);
    });
}

function addStep(description) {
    const container = document.getElementById('algorithmProcess');
    const step = document.createElement('div');
    step.className = 'step';
    step.textContent = description;
    container.appendChild(step);
    container.scrollTop = container.scrollHeight;
}

// Simulaciones de algoritmos
async function bubbleSortSimulation(arr, speed) {
    let comparisons = 0;
    let swaps = 0;
    const startTime = performance.now();
    const n = arr.length;
    let sorted = false;
    
    document.getElementById('comparisonCount').textContent = '0';
    document.getElementById('swapCount').textContent = '0';
    document.getElementById('algorithmProcess').innerHTML = '';
    addStep('Iniciando Bubble Sort...');
    
    for (let i = 0; i < n - 1; i++) {
        if (sorted) break;
        sorted = true;
        
        for (let j = 0; j < n - i - 1; j++) {
            // Resaltar elementos comparados
            visualizeArray(arr, j, Array.from({length: i}, (_, idx) => n - 1 - idx));
            
            comparisons++;
            document.getElementById('comparisonCount').textContent = comparisons;
            addStep(`Comparando ${arr[j]} y ${arr[j+1]} en posiciones ${j} y ${j+1}`);
            
            // Esperar antes de la siguiente operación
            await sleep(1000 / speed);
            
            if (arr[j] > arr[j+1]) {
                // Intercambiar
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
                swaps++;
                document.getElementById('swapCount').textContent = swaps;
                addStep(`Intercambiando ${arr[j+1]} y ${arr[j]} en posiciones ${j} y ${j+1}`);
                sorted = false;
                
                // Actualizar visualización después del intercambio
                visualizeArray(arr, j+1, Array.from({length: i}, (_, idx) => n - 1 - idx));
                await sleep(1000 / speed);
            }
        }
    }
    
    const endTime = performance.now();
    document.getElementById('simulationTime').textContent = (endTime - startTime).toFixed(2);
    visualizeArray(arr, -1, Array.from({length: n}, (_, i) => i));
    addStep('¡Ordenamiento completado!');
}

// Funciones de simulación para otros algoritmos (similares a bubbleSortSimulation)
// Se implementarían de manera similar con sus respectivas lógicas

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}