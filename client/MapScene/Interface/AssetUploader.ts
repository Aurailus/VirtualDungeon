interface UploadFile {
	file: File;
	image: string;
	name: string;
	identifier: string;
	status: number;
}

enum FileStatus { 
	ACCEPTED, 
	FAILED, 
	TYPE_INVALID, 
	FILE_LIMIT, 
	ACCT_LIMIT 
}

const uploadLimit = 2 * 1024 * 1024;

class AssetUploader {
	private scene: MapScene;
	private root: HTMLDivElement;

	private filesList: UploadFile[] = [];

	private fileSelector: HTMLInputElement;
	private filesWrapper: HTMLDivElement;
	private uploadButton: HTMLButtonElement;

	private uploading: boolean = false;

	constructor(scene: MapScene) {
		this.scene = scene;
		this.scene.i.setFocus(false);

		this.root = document.createElement("div");
		this.root.classList.add("modal_wrap");
		this.root.innerHTML = `
			<div class="upload_modal">
				<h1>Upload Custom Tokens</h1>
				<form class="upload_form">
					<input type="file" name="upload_input" multiple />
					<label>Click here or drag to upload assets.</label>
				</form>
				<div class="files"></div>
				<button class="upload" disabled>
					<p>Upload</p>
				</button>
			</div>`;

		document.documentElement.append(this.root);

		this.fileSelector = document.querySelector("input[name=upload_input]") as HTMLInputElement;
		this.filesWrapper = document.querySelector(".upload_modal .files") as HTMLDivElement;
		this.uploadButton = document.querySelector(".upload_modal .upload") as HTMLButtonElement;

		this.fileSelector.addEventListener("change", (e) => {
			Promise.all(Array.from(this.fileSelector.files || []).map(
				async (file: File) => await this.addFileToList(file)))
			.then(() => this.renderFileList());
			this.fileSelector.value = "";
		});

		this.uploadButton.addEventListener("click", (e) => {
			this.uploadButton.disabled = true;
			this.uploadButton.innerHTML = "<p>Uploading</p>";
			this.root.querySelector(".upload_form")!.remove();

			this.uploading = true;
			this.renderFileList();
			this.initiateUpload();
		});
	}

	private async addFileToList(file: File) {
		return new Promise((resolve, reject) => {
			let status = -1;
			if (file.size > uploadLimit) status = FileStatus.FILE_LIMIT;
			else if (file.type != "image/png" && file.type != "image/jpeg") status = FileStatus.TYPE_INVALID;

			let chosenName = file.name;

			let addFile = (res: string) => {
				this.filesList.push({
					file: file, 
					image: res, 
					name: chosenName, 
					identifier: "", 
					status: status });
				resolve();
			}

			if (status == -1) {
				chosenName = file.name.substr(0, file.name.lastIndexOf(".")).replace(/_+/g, " ")
					.split(" ").map(([firstChar, ...rest]) => firstChar.toUpperCase() + rest.join("").toLowerCase()).join(" ");

				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => addFile(reader.result as string);
			}
			else addFile("");
		});
	}

	private initiateUpload() {
		setTimeout(() => {
			Promise.all(this.filesList.map(async (file) => await this.uploadFile(file))).then(() => {
				console.log("all done~");
			})
		}, 300);
	}

	private async uploadFile(file: UploadFile): Promise<void> {
		return new Promise((resolve, reject) => {
			let form = new FormData();
			let xhr = new XMLHttpRequest();

			form.set('file', file.file);
			form.set('name', file.name);
			form.set('identifier', file.identifier || file.name.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, ''));

			xhr.addEventListener("load", (e) => {
				file.status = Number.parseInt(xhr.responseText);
				this.renderFileList();
				resolve();
			});

			xhr.open("POST", "/assets/upload/token");
			xhr.send(form);
		});
	}

	private renderFileList() {
		this.filesWrapper.innerHTML = "";

		let allValid = true;
		for (let i = 0; i < this.filesList.length; i++) {
			let file = this.filesList[i];

			let errorString = 
				file.status == FileStatus.FAILED       ? "An unknown error occured." :
				file.status == FileStatus.TYPE_INVALID ? "Assets must be a JPEG or PNG." :
				file.status == FileStatus.FILE_LIMIT   ? "Assets must be less than 2 MB." :
				file.status == FileStatus.ACCT_LIMIT   ? "You've exceeded your asset limit." : ""

			const fileDiv = document.createElement("div");
			fileDiv.classList.add("upload_file");
			fileDiv.innerHTML = `
				<div class="upload_preview_wrap">
					<button title="Cancel" class="upload_preview" style="background-image: url(${file.image});"></button>
				</div>
				<div class="input_wrap"><input placeholder="Name" name="name"/></div>
				${(file.status == -1 || file.status == 0) ?
					'<div class="input_wrap"><input name="identifier"/></div>' : '<p class="error">' + errorString + '</p>'}
			`;

			const name = fileDiv.querySelector("input[name=name]") as HTMLInputElement;
			const identifier = fileDiv.querySelector("input[name=identifier]") as HTMLInputElement | null;

			name.value = file.name;

			if (!identifier) {
				name.disabled = true;
			}
			else {
				name.disabled = this.uploading;
				identifier.disabled = this.uploading;

				identifier.value = file.identifier;
				identifier.placeholder = file.name.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '') || "Identifier";

				name.addEventListener("input", () => {
					file.name = name.value;
					if (!identifier.value) identifier.placeholder = name.value.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
				});

				identifier.addEventListener("input", () => {
	  			let start = identifier.selectionStart!;
	        let end = identifier.selectionEnd!;

	        let oldVal = identifier.value;
					identifier.value = identifier.value.toLowerCase().replace(/[ -]/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
					
					if (oldVal.length > identifier.value.length) {
						start -= oldVal.length - identifier.value.length;
						end -= oldVal.length - identifier.value.length;
					}

	    		identifier.setSelectionRange(start, end);
					file.identifier = identifier.value
				});
			}

			fileDiv.querySelector("button")!.addEventListener("click", () => {
				this.filesList.splice(i, 1);
				this.renderFileList();
			});			

			if (this.uploading && file.status == -1) fileDiv.classList.add("loading");
			else if (file.status == 0) fileDiv.classList.add("success");
			else if (file.status != -1) fileDiv.classList.add("failed");

			this.filesWrapper.append(fileDiv);

			if (file.status != -1) allValid = false;
		}

		this.uploadButton.disabled = this.uploading || !allValid;
	}
}
