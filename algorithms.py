import random
import time

def generar_lista(tam, tipo='random'):
    if tipo == 'random':
        return [random.randint(1, 1000) for _ in range(tam)]
    elif tipo == 'sorted':
        return list(range(1, tam+1))
    elif tipo == 'reversed':
        return list(range(tam, 0, -1))
    elif tipo == 'nearly_sorted':
        arr = list(range(1, tam+1))
        # Introducir algunas inversiones
        for _ in range(max(1, tam//10)):
            i, j = random.sample(range(tam), 2)
            arr[i], arr[j] = arr[j], arr[i]
        return arr
    else:
        return [random.randint(1, 1000) for _ in range(tam)]

def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr

def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i-1
        while j >= 0 and key < arr[j]:
            arr[j+1] = arr[j]
            j -= 1
        arr[j+1] = key
    return arr

def selection_sort(arr):
    for i in range(len(arr)):
        min_idx = i
        for j in range(i+1, len(arr)):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

def merge_sort(arr):
    if len(arr) > 1:
        mid = len(arr)//2
        L = arr[:mid]
        R = arr[mid:]
        merge_sort(L)
        merge_sort(R)
        
        i = j = k = 0
        while i < len(L) and j < len(R):
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

def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr)//2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

def medir_tiempo(func, arr):
    start_time = time.perf_counter()
    func(arr.copy())
    end_time = time.perf_counter()
    return (end_time - start_time) * 1000  # ms