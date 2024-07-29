.PHONY: init setup clean build dev composer npm craft nuke pull install up

init:
	# Create .env file
	if [ ! -f .env ]; then \
		cp .env.example .env; \
	fi

	# Remove composer.json from craftcms-ddev project
	if [ -f composer.json.default ]; then \
		rm composer.json; \
	fi
	# Create new composer.json from default file
	if [ -f composer.json.default ]; then \
		mv -f composer.json.default composer.json; \
	fi

	# Remove .gitignore from craftcms-ddev project
	if [ -f .gitignore.default ]; then \
		rm .gitignore; \
	fi
	# Create new .gitignore from default file
	if [ -f .gitignore.default ]; then \
		mv -f .gitignore.default .gitignore; \
	fi

	# Remove README.md from craftcms-ddev project
	if [ -f README.default.md ]; then \
		if [ -f README.md ]; then \
			rm README.md; \
		fi \
	fi
	# Create new README.md from default file
	if [ -f README.default.md ]; then \
		mv -f README.default.md README.md; \
	fi

	# Remove changelog file
	if [ -f CHANGELOG.md ]; then \
		rm CHANGELOG.md; \
	fi
	# Remove license file
	if [ -f LICENSE.md ]; then \
		rm LICENSE.md; \
	fi
setup:
	ddev config
	make install
clean:
	rm -f composer.lock
	rm -rf vendor/
	rm -f package-lock.json
	rm -rf node_modules/
build: up
	ddev exec npm run build
dev: up
	ddev launch
	ddev exec npm run dev
composer: up
	ddev composer \
		$(filter-out $@,$(MAKECMDGOALS))
npm: up
	ddev exec npm \
		$(filter-out $@,$(MAKECMDGOALS))
craft: up
	ddev exec php craft \
		$(filter-out $@,$(MAKECMDGOALS))
nuke: clean
	ddev composer install
	ddev exec npm install
pull: up
	ddev exec bash scripts/pull_assets.sh
	ddev exec bash scripts/pull_db.sh
install: up \
    ddev composer install; \
    ddev exec npm install; \
	ddev exec php craft setup/app-id \
		$(filter-out $@,$(MAKECMDGOALS))
	ddev exec php craft setup/security-key \
		$(filter-out $@,$(MAKECMDGOALS))
	ddev exec php craft install \
		$(filter-out $@,$(MAKECMDGOALS))
	ddev exec php craft plugin/install aws-s3
	ddev exec php craft plugin/install cp-clearcache
	ddev exec php craft plugin/install cp-field-inspect
	ddev exec php craft plugin/install craft-ray
	ddev exec php craft plugin/install ckeditor
	ddev exec php craft plugin/install quick-field
	ddev exec php craft plugin/install seomatic
	ddev exec php craft plugin/install hyper
	ddev exec php craft plugin/install vite
up:
	if [ ! "$$(ddev describe | grep OK)" ]; then \
        ddev auth ssh; \
        ddev start; \
    fi
%:
	@:
# ref: https://stackoverflow.com/questions/6273608/how-to-pass-argument-to-makefile-from-command-line
