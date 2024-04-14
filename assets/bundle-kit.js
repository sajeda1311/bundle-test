document.addEventListener("DOMContentLoaded", function () {
    var addButton = document.querySelector("button[name=add]");
    var flkty = new Flickity('.carousel');

    if (addButton.disabled) {
        document.querySelector("span[data-add-to-cart-text]").textContent = document.querySelectorAll("#BundleSelectedStencils .empty").length + " Selections Remaining";
    }

    let selectedStencils = {}; // Object to store selected stencil names and unique numbers

    document.querySelectorAll("#BundleStencilProductsListings li").forEach(function (li) {
        li.addEventListener("click", function () {
            var productName = li.getAttribute("data-product-name");

            if (selectedStencils[productName]) {
                alert("You have already selected this stencil.");
                return false;
            }

            let uniqueNumber = Object.keys(selectedStencils).length + 1;
            selectedStencils[productName] = uniqueNumber;

            var hiddenInput = document.createElement("input");
            hiddenInput.type = "hidden";
            hiddenInput.classList.add("BundleStencil_" + uniqueNumber);
            hiddenInput.name = "properties[Selected Stencil-" + uniqueNumber + "]";
            hiddenInput.value = productName;

            var stencil = li.innerHTML;
            var classCheck = li.classList.contains("selected_stencil");
            var parentElement = document.querySelector("#BundleSelectedStencils");
            var isEmpty = !parentElement.querySelector(".empty");

            if (isEmpty) {
                alert("You have already selected the maximum stencils.");
                return false;
            } else {
                document.querySelector("#BundleSelectedStencilsKit").appendChild(hiddenInput);
                console.log(productName);
                var selectedStencilss = document.querySelectorAll("#BundleSelectedStencils .active").length;

                if (selectedStencilss > 0) {
                    flkty.next();
                }
            }

            var emptyFirst = document.querySelector("#BundleSelectedStencils .empty:first-child");
            if (emptyFirst) {
                emptyFirst.innerHTML += stencil;
                emptyFirst.classList.remove("empty");
                emptyFirst.classList.add("active");
                li.classList.add("selected_stencil");
                var firstEmptyInput = document.querySelector("#BundleSelectedStencilsKit input.empty:first-child");

                if (firstEmptyInput) {
                    var textNode = document.createTextNode(productName);
                    firstEmptyInput.appendChild(textNode);
                    firstEmptyInput.classList.remove("empty");
                    firstEmptyInput.classList.add("active");
                    var screenWidth = window.innerWidth;
                    var emptyLength = document.querySelectorAll("#BundleSelectedStencils .empty").length;
                }
            }

            var emptyLengthAfter = document.querySelectorAll("#BundleSelectedStencils .empty").length;
            if (emptyLengthAfter == 0) {
                document.querySelector("span[data-add-to-cart-text]").textContent = "Add to Cart";
                document.querySelector("button[name=add]").removeAttribute("disabled");
            } else {
                document.querySelector("button[name=add]").setAttribute("disabled", "disabled");
                document.querySelector("span[data-add-to-cart-text]").textContent = emptyLengthAfter + " Remaining";
            }

            document.querySelector("#LeftCount").textContent = document.querySelectorAll("#BundleSelectedStencils .active").length;
            return false;
        });
    });

    document.querySelector("#BundleStencilKitFilters").addEventListener("change", function () {
        var selectedValue = this.value;
        document.querySelector("#BundleStencilProductsListings").className = selectedValue;
    });

    document.querySelectorAll("#BundleProductFilters a").forEach(function (filter) {
        filter.addEventListener("click", function (event) {
            event.preventDefault();
            var filterName = filter.getAttribute("data-selected");
            console.log(filterName);
            document.querySelectorAll("#BundleProductFilters a").forEach(function (filter) {
                filter.classList.remove("active");
            });
            filter.classList.add("active");
            document.querySelector("#BundleStencilProductsListings").className = filterName;
            return false;
        });
    });

    document.querySelector("#BundleSelectedStencils").addEventListener("click", function (event) {
        if (event.target.matches("#BundleSelectedStencils button")) {
            var button = event.target;
            var removeStencilId = button.getAttribute("data-stencil-id");
            var prodName = document.querySelector("#" + removeStencilId + " span:last-child").textContent;
            var listElm = document.querySelector("#BundleStencilProductsListings [data-product-name='" + prodName + "']");
            document.querySelector("#" + removeStencilId).classList.remove("active");
            document.querySelector("#" + removeStencilId).classList.add("empty");
            document.querySelector("#" + removeStencilId + " span").remove();
            document.querySelector("#" + removeStencilId + " span:last-child").remove();

            var prodCheckSelect = document.querySelectorAll("#BundleSelectedStencils .active [data-product='" + prodName + "']");
            if (prodCheckSelect.length == 0) {
                listElm.classList.remove("selected_stencil");
            }

            var emptyLengthAfter = document.querySelectorAll("#BundleSelectedStencils .empty").length;
            if (emptyLengthAfter == 0) {
                document.querySelector("span[data-add-to-cart-text]").textContent = "Add to Cart";
                document.querySelector("button[name=add]").removeAttribute("disabled");
            } else {
                document.querySelector("button[name=add]").setAttribute("disabled", "disabled");
                document.querySelector("span[data-add-to-cart-text]").textContent = emptyLengthAfter + " Remaining";
            }

            var hiddenInput = document.querySelector("." + removeStencilId);
            if (hiddenInput) {
                hiddenInput.remove();
                delete selectedStencils[prodName];
                let index = 1;
                document.querySelectorAll("#BundleSelectedStencilsKit input[type=hidden]").forEach(function (input) {
                    let productName = input.value;
                    selectedStencils[productName] = index;
                    input.name = "properties[selected-stencil-" + index + "]";
                    input.classList.remove(...input.classList);
                    input.classList.add("BundleStencil_" + index);
                    index++;
                });
            }

            document.querySelector("#leftCount").textContent = document.querySelectorAll("#BundleSelectedStencils .empty").length;
        }
        flkty.select(0);
    });

    document.querySelectorAll(".add-to-cart-clone").forEach(function (clone) {
        clone.addEventListener("click", function () {
            document.querySelector(".product-form").submit();
        });
    });

    document.querySelectorAll("form.grid-add-cart-btn").forEach(function (form) {
        form.addEventListener("submit", function (event) {
            event.preventDefault();
            var variantID = form.querySelector("input[name=id]").value;
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/cart/add.js", true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        var currentCount = parseInt(document.querySelector("span[data-cart-count]").textContent.trim());
                        currentCount += 1;
                        document.querySelector("span[data-cart-count]").textContent = currentCount;
                        document.querySelector("#CartCount").classList.remove("hide");
                        document.querySelector(".cart-notification[data-variant-id='" + variantID + "']").textContent = "Added";
                        document.querySelector(".cart-notification[data-variant-id='" + variantID + "']").style.display = "block";
                        setTimeout(function () {
                            document.querySelector(".cart-notification[data-variant-id='" + variantID + "']").style.display = "none";
                        }, 3000);
                    } else {
                        alert(xhr.responseText);
                    }
                }
            };
            xhr.send(JSON.stringify({ quantity: 1, id: variantID }));
        });
    });
});