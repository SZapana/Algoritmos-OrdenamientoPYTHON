from flask import Flask, render_template, jsonify, request
from algorithms import generar_lista, medir_tiempo, bubble_sort, insertion_sort, selection_sort, merge_sort, quick_sort
import json

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run-comparison', methods=['POST'])
def run_comparison():
    data = request.json
    size = data['size']
    array_type = data['arrayType']
    selected_algorithms = data['algorithms']
    
    arr = generar_lista(size, array_type)
    
    results = {}
    algorithms = {
        'bubble': bubble_sort,
        'insertion': insertion_sort,
        'selection': selection_sort,
        'merge': merge_sort,
        'quick': quick_sort
    }
    
    for algo in selected_algorithms:
        if algo in algorithms:
            results[algo] = medir_tiempo(algorithms[algo], arr)
    
    return jsonify(results)

@app.route('/get-algorithm-info/<algo_name>')
def get_algorithm_info(algo_name):
    algorithms_info = {
        'bubble': {
            'name': 'Bubble Sort',
            'description': 'Compara elementos adyacentes y los intercambia si están en el orden incorrecto.',
            'complexity': {
                'best': 'O(n)',
                'average': 'O(n²)',
                'worst': 'O(n²)'
            },
            'code': '''
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr
            '''
        },
        'insertion': {
            'name': 'Insertion Sort',
            'description': 'Construye la secuencia final un elemento a la vez insertando cada elemento en su posición correcta.',
            'complexity': {
                'best': 'O(n)',
                'average': 'O(n²)',
                'worst': 'O(n²)'
            },
            'code': '''
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1
        while j >=0 and key < arr[j]:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
    return arr
            '''
        },
        'selection': {
            'name': 'Selection Sort',
            'description': 'Divide el arreglo en una parte ordenada y otra no ordenada, seleccionando repetidamente el mínimo elemento.',
            'complexity': {
                'best': 'O(n²)',
                'average': 'O(n²)',
                'worst': 'O(n²)'
            },
            'code': '''
def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr
            '''
        },
        'merge': {
            'name': 'Merge Sort',
            'description': 'Divide el arreglo en mitades, las ordena recursivamente y luego combina las mitades ordenadas.',
            'complexity': {
                'best': 'O(n log n)',
                'average': 'O(n log n)',
                'worst': 'O(n log n)'
            },
            'code': '''
def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr)//2
        L = arr[:mid]
        R = arr[mid:]
        merge_sort(L)
        merge_sort(R)
        
        i = j = k = 0
        while i < len(L) and j < len(R)):
            if L[i] < R[j]:
                arr[k] = L[i]
                i += 1
            else:
                arr[k] = R[j]
                j += 1
            k += 1
            
        while i < len(L):
            arr[k] = L[i]
            i += 1
            k += 1
            
        while j < len(R):
            arr[k] = R[j]
            j += 1
            k += 1
    return arr
            '''
        },
        'quick': {
            'name': 'Quick Sort',
            'description': 'Selecciona un "pivote", particiona el arreglo alrededor del pivote, y ordena recursivamente las particiones.',
            'complexity': {
                'best': 'O(n log n)',
                'average': 'O(n log n)',
                'worst': 'O(n²)'
            },
            'code': '''
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr)//2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)
            '''
        }
    }
    
    if algo_name in algorithms_info:
        return jsonify(algorithms_info[algo_name])
    return jsonify({'error': 'Algorithm not found'}), 404

if __name__ == '__main__':
    app.run(debug=True)