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

        <!-- INCLUDING CSS INJECTION -->
        <?php include 'dev/css_partial.html'; ?>

        <!-- JS detection for setting html class as "js" or "no-js" -->
        <script>(function(e) { e.className = e.className.replace(/\bno-js\b/,'js'); })(document.documentElement);</script>

        <!--  JS detection for touch devices - adds "touch" or "no-touch" to the html element -->
        <script>(function(w, d) {
            var hasTouch = ('ontouchstart' in w) || w.DocumentTouch && d instanceof DocumentTouch;
            d.documentElement.className += ' ' + (hasTouch ? 'touch' : 'no-touch');
        })(window, document);</script>

    </head>

    <body ng-app="app">
        <div>
            <base href="/"></base>
            
            <header class="header header--default header--big">
                <div class="container t_padding-vertical-xs-4">

                    <div class="row">
                        <div class="col-xs-2">
                            <img class="logo pull-left t_margin-right-xs-4" src="images/logo_guitar.png">
                            <div class="pull-left">
                                <p>Cours-guitare-facile.com</p>
                                <p>La guitare accessible à tous.</p>
                            </div>
                        </div>

                        <div class="col-xs-4">
                            <a class="button-musique  is-active  t_margin-right-xs-4">
                                <span class="text-anchor">Accueil</span>
                            </a>
                            <a class="button-musique t_margin-right-xs-4">Nos Cours</a>
                            <a class="button-musique t_margin-right-xs-4">Instruments</a>
                            <a class="button-musique t_margin-right-xs-4">Notre offre</a>

                            <button class="">Me connecter</button>
                        </div>
                    </div>

                    <!-- INCLUDE ANGULAR DIRECTIVE FOR COOKIES -->
                    <cookies-notification policy-link = "This site uses cookies"></cookies-notification>

                </div>
            </header>

            
            {% include 'BOFFrameworkBundle:partials:navigation.html.twig' %}
            
            <div class="bof-main-content">
                content....
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

    <!-- INCLUDING JS INJECTION -->
    <?php include 'dev/spa.js.html'; ?>

</html>

