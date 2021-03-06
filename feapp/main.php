<!DOCTYPE html>
<html lang="fr">
    <head>
        <title>Cours de Musique</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,user-scalable=no,shrink-to-fit=no">
        <meta name="handheldfriendly" content="true">
        <meta name="mobileoptimized" content="320">
        <meta http-equiv="cleartype" content="on">
        <meta name="apple-mobile-web-app-capable" content="yes">
        <meta name="apple-mobile-web-app-title" content="Cours de Musique">
        <meta name="robots" content="noindex, nofollow"/>
    </head>

    <body ng-app="app">
        <div>
            <base href="/"></base>
            
            <header class="header header--default hidden-sm hidden-xs hidden-print">

                <!-- INCLUDE ANGULAR DIRECTIVE FOR COOKIES -->
                <cookies-notification policy-link = "This site uses cookies"></cookies-notification>

                <div class="header-meta padded-top padded-bottom hidden-sm hidden-xs">
                    <!-- div class="container"></div -->
                    <img class="logo" src="images/logo_guitar.png">
                    <div class="">
                        <p>Cours-guitare-facile.com</p>
                        <p>La guitare accessible à tous.</p>
                    </div>
                    <span class="">Accueil</span>
                    <span class="">Nos Cours</span>
                    <span class="">Instruments</span>
                    <span class="">Notre offre</span>
                    <span class="">Me connecter</span>
                </div>
            </header>

            
            {% include 'BOFFrameworkBundle:partials:navigation.html.twig' %}
            
            <div class="bof-main-content">
                content.... this is the main
            </div>
            

            <footer class="footer border-top hidden-print background-default">
                <div class="row offset-top-medium">
                    <span class="">Paiement sécurité</span>
                    <span class="">Cours de Musique</span>
                    <span class="">Cours de Guitare</span>
                    <span class="">Cours de Piano</span>
                    <span class="">Cours Basse</span>
                    <span class="">Cours Batterie</span>
                </div>
                <div>
                    <button>Inscrivez vous</button>
                    <span class="">Accès illimité à les cours</span>
                </div>
                <div class="row offset-top-medium">
                    <span class="">Mention légale</span>
                    <span class="">Conditions générales de vente</span>
                    <span class="">Qui sommes nous?</span>
                </div>
                <!--div class="container"></div-->
            </footer>
            
        </div>
    </body>
</html>

