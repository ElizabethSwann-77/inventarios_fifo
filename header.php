 <!-- Left Panel -->
 <aside id="left-panel" class="left-panel">
     <nav class="navbar navbar-expand-xl navbar-default">
        
            <div class="navbar-header">
                <a class="navbar-brand" href="logout.php"><img src="images/logo.png" alt="Logo" style="margin-top: 5px; margin-bottom: 10px;"></a>
                <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#main-menu" aria-controls="main-menu" aria-expanded="false" aria-label="Toggle navigation">
                    <i class="fa fa-bars"></i>
                </button>
            </div>

            <?php
                function navActive($page) {
                    return basename($_SERVER['PHP_SELF']) == $page ? 'nav-active' : '';
                }
            ?>

            <div id="main-menu" class="main-menu collapse navbar-collapse">
                <ul class="nav navbar-nav">
                    <h3 class="menu-title">Formularios</h3><!-- /.menu-title -->
                    <li class="<?= navActive('partes.php') ?>">
                        <a href="partes.php">Formulario FIFO</a>
                    </li>
                    <li class="<?= navActive('proyectos.php') ?>">
                        <a href="proyectos.php">Proyectos</a>
                    </li>

                    <?php if (isset($_SESSION['puesto']) && $_SESSION['puesto'] === 'ADM'): ?>
                        <h3 class="menu-title">Control Admin</h3><!-- /.menu-title -->
                        <li class="<?= navActive('admin.php') ?>">
                            <a href="admin.php">Control Admin</a>
                        </li>
                    <?php endif; ?>

                </ul>
                <div class="user-footer-mobile d-block d-xl-none mt-3">
                    <div class="username">
                        <?php echo $_SESSION['nombre_usuario'] ?? 'Usuario'; ?>
                    </div>
                    <a href="logout.php" class="btn btn-danger btn-sm btn-block mt-2 btn-logout-mobile">
                        <i class="fa fa-sign-out"></i> SALIR
                    </a>
                </div>
            </div><!-- /.navbar-collapse -->
        </nav>

        <div class="user-footer">
            <div class="username">
                <?php echo $_SESSION['nombre'] ?? 'Usuario'; ?>
            </div>
            <a href="logout.php" class="btn btn-danger btn-sm btn-block mt-2 btn-logout">
                <i class="fa fa-sign-out"></i> SALIR
            </a>
        </div>
        
    </aside><!-- /#left-panel -->

    <!-- Left Panel -->