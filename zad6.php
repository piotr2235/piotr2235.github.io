<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Formularz Rejestracyjny - Zadanie 6</title>
    
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f0f2f5; 
            color: #333;
            display: flex;
            flex-direction: column; /* Zmiana na column, żeby podsumowanie było pod formularzem */
            align-items: center;
            padding: 20px;
            min-height: 100vh;
        }

        form {
            background-color: #ffffff; 
            padding: 25px;
            border-radius: 8px; 
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            max-width: 500px; 
            width: 100%;
            margin-bottom: 20px;
        }

        .form-group {
            margin-bottom: 15px;
        }

        label {
            display: block; 
            margin-bottom: 5px;
            font-weight: bold;
        }

        input[type="text"],
        input[type="tel"],
        input[type="email"],
        input[type="password"],
        input[type="date"],
        textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            box-sizing: border-box; 
        }
        
        input:focus,
        textarea:focus {
            border-color: #007bff; 
            outline: none; 
        }

        fieldset {
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 10px;
            margin-bottom: 15px;
        }

        legend {
            font-weight: bold;
            padding: 0 5px; 
        }

        .radio-option {
            display: flex;
            align-items: center; 
            margin-bottom: 5px;
        }
        
        input[type="radio"] {
            margin-right: 8px;
        }

        input[type="submit"] {
            background-color: #007bff; 
            color: white; 
            padding: 12px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer; 
            font-size: 16px;
            font-weight: bold;
            width: 100%; 
            transition: background-color 0.2s;
        }

        input[type="submit"]:hover {
            background-color: #0056b3; 
        }

        /* Styl dla sekcji podsumowania PHP */
        .summary-box {
            background-color: #e8f4fd;
            border: 2px solid #007bff;
            padding: 25px;
            border-radius: 8px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            margin-top: 20px;
            animation: fadeIn 0.5s ease-in;
        }

        .summary-box h2 {
            margin-top: 0;
            color: #0056b3;
            border-bottom: 1px solid #ccc;
            padding-bottom: 10px;
        }

        .summary-item {
            margin-bottom: 8px;
            font-size: 1.1em;
        }

        .summary-label {
            font-weight: bold;
            color: #555;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
    </style>
</head>
<body>

    <!-- Zmiana: action="" wysyła formularz do tego samego pliku, method="POST" jest bezpieczniejsze -->
    <form action="" method="POST">

        <div class="form-group">
            <label for="Imie">Imię:</label>
            <input type="text" id="Imie" name="Imie" placeholder="np. Jan" maxlength="15" required>
        </div>

        <div class="form-group">
            <label for="Nazwisko">Nazwisko:</label>
            <input type="text" id="Nazwisko" name="Nazwisko" placeholder="np. Kowalski" maxlength="15" required>
        </div>

        <div class="form-group">
            <label for="miasto">Miasto</label>
            <input type="text" id="miasto" name="miasto" placeholder="np. Warszawa" required>
        </div>

        <div class="form-group">
            <label for="ulica">Ulica:</label>
            <input type="text" id="ulica" name="ulica" placeholder="np. Marszałkowska" required>
        </div>

        <div class="form-group">
            <label for="tel">Tel:</label>
            <input type="tel" id="tel" name="tel" placeholder="np. 123-456-789" pattern="[0-9]{3}-[0-9]{3}-[0-9]{3}" required>
        </div>

        <div class="form-group">
            <label for="mail">E-mail:</label>
            <input type="email" id="mail" name="mail" placeholder="np. JanKowalski@gmail.com" required>
        </div>

        <div class="form-group">
            <label for="haslo">Hasło:</label>
            <input type="password" id="haslo" name="haslo" placeholder="********" maxlength="15" required>
        </div>

        <div class="form-group">
            <label for="data">Data urodzenia:</label>
            <input type="date" id="data" name="data" required>
        </div>

        <fieldset>
            <legend>Prawo jazdy:</legend>
            <div class="radio-option">
                <input type="radio" id="tak" value="tak" name="prawoj" required>
                <label for="tak">TAK</label>
            </div>
            <div class="radio-option">
                <input type="radio" id="nie" value="nie" name="prawoj" required>
                <label for="nie">NIE</label>
            </div>
        </fieldset>

        <fieldset>
            <legend>Płeć:</legend>
            <div class="radio-option">
                <input type="radio" id="M" value="M" name="plec" required>
                <label for="M">M</label>
            </div>
            <div class="radio-option">
                <input type="radio" id="K" value="K" name="plec" required>
                <label for="K">K</label>
            </div>
            <div class="radio-option">
                <input type="radio" id="N" value="N" name="plec" required>
                <label for="N">NIE POWIEM</label>
            </div>
        </fieldset>

        <div class="form-group">
            <label for="opinia">Opinia:</label>
            <textarea id="opinia" name="opinia" placeholder="np. Napisz swoja opinie" maxlength="200" rows="4"></textarea>
        </div>

        <input type="submit" value="Zarejestruj się">
    </form>

    <?php
    // Sprawdzamy, czy formularz został wysłany metodą POST
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        
  
        $imie = htmlspecialchars($_POST['Imie'] ?? '');
        $nazwisko = htmlspecialchars($_POST['Nazwisko'] ?? '');
        $miasto = htmlspecialchars($_POST['miasto'] ?? '');
        $ulica = htmlspecialchars($_POST['ulica'] ?? '');
        $telefon = htmlspecialchars($_POST['tel'] ?? '');
        $email = htmlspecialchars($_POST['mail'] ?? '');
        $haslo = htmlspecialchars($_POST['haslo'] ?? ''); 
        $dataUrodzenia = htmlspecialchars($_POST['data'] ?? '');
        $prawoJazdy = htmlspecialchars($_POST['prawoj'] ?? 'Brak wyboru');
        $plec = htmlspecialchars($_POST['plec'] ?? 'Brak wyboru');
        $opinia = htmlspecialchars($_POST['opinia'] ?? 'Brak opinii');

        // Wyświetlanie bloku HTML z podsumowaniem
        echo '<div class="summary-box">';
        echo '<h2>Podsumowanie Rejestracji</h2>';
        
        echo '<div class="summary-item"><span class="summary-label">Imię i Nazwisko:</span> ' . $imie . ' ' . $nazwisko . '</div>';
        echo '<div class="summary-item"><span class="summary-label">Adres:</span> ul. ' . $ulica . ', ' . $miasto . '</div>';
        echo '<div class="summary-item"><span class="summary-label">Kontakt:</span> ' . $telefon . ' | ' . $email . '</div>';
        echo '<div class="summary-item"><span class="summary-label">Data urodzenia:</span> ' . $dataUrodzenia . '</div>';
       
        $plecText = ($plec == 'M') ? 'Mężczyzna' : (($plec == 'K') ? 'Kobieta' : 'Nie podano');
        echo '<div class="summary-item"><span class="summary-label">Płeć:</span> ' . $plecText . '</div>';
        
        echo '<div class="summary-item"><span class="summary-label">Prawo jazdy:</span> ' . strtoupper($prawoJazdy) . '</div>';
      
        echo '<div class="summary-item" style="color:red; font-size: 0.9em;"><span class="summary-label">Hasło (tylko do podglądu):</span> ' . $haslo . '</div>';
        
        if (!empty($opinia)) {
            echo '<div class="summary-item"><span class="summary-label">Twoja opinia:</span> <br><i>' . nl2br($opinia) . '</i></div>';
        }

        echo '</div>';
    }
    ?>

</body>
</html>
